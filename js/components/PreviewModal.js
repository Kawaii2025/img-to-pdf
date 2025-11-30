class PreviewModal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.image = this.modal.querySelector('#modal-image');
        this.closeBtn = this.modal.querySelector('#modal-close');
        this.prevBtn = this.modal.querySelector('#modal-prev');
        this.nextBtn = this.modal.querySelector('#modal-next');
        this.info = this.modal.querySelector('#modal-info');
        this.isProcessing = false;
        
        // 缩放相关
        this.zoom = 1;
        this.minZoom = 0.5;
        this.maxZoom = 3;
        this.zoomStep = 0.2;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.translateX = 0;
        this.translateY = 0;
        
        // 追踪当前图片信息
        this.currentIndex = 0;
        this.totalImages = 0;
        this.allFiles = [];
        this.onNavigate = null;
        
        this.init();
    }

    init() {
        this.closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });
        
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showPrevious();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showNext();
        });
        
        // 鼠标滚轮缩放
        this.modal.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        
        // 双击重置缩放
        this.image.addEventListener('dblclick', () => this.resetZoom());
        
        // 鼠标拖拽移动
        this.image.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // 触摸缩放（移动设备）
        this.modal.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.modal.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.modal.addEventListener('touchend', () => this.handleTouchEnd());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'flex') {
                if (e.key === 'Escape') this.close();
                if (e.key === 'ArrowLeft') this.showPrevious();
                if (e.key === 'ArrowRight') this.showNext();
                if (e.key === '+' || e.key === '=') this.zoomIn();
                if (e.key === '-') this.zoomOut();
                if (e.key === '0') this.resetZoom();
            }
        });
    }

    open(src, file, index, total, allFiles = []) {
        if (this.isProcessing) return;
        
        this.currentIndex = index;
        this.totalImages = total;
        this.allFiles = allFiles;
        
        this.image.src = src;
        this.info.textContent = `图片 ${index + 1}/${total} | ${file.name} | ${this.formatFileSize(file.size)}`;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // 重置缩放
        this.resetZoom();
        this.updateNavButtons();
    }

    updateNavButtons() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.totalImages - 1;
    }

    showPrevious() {
        if (this.currentIndex > 0 && this.allFiles.length > 0) {
            this.currentIndex--;
            this.updateImage();
        }
    }

    showNext() {
        if (this.currentIndex < this.totalImages - 1 && this.allFiles.length > 0) {
            this.currentIndex++;
            this.updateImage();
        }
    }

    updateImage() {
        const file = this.allFiles[this.currentIndex];
        const reader = new FileReader();
        reader.onload = (e) => {
            this.image.src = e.target.result;
            this.info.textContent = `图片 ${this.currentIndex + 1}/${this.totalImages} | ${file.name} | ${this.formatFileSize(file.size)}`;
            this.updateNavButtons();
            this.resetZoom();
        };
        reader.readAsDataURL(file);
    }

    handleWheel(e) {
        if (this.modal.style.display !== 'flex') return;
        e.preventDefault();
        
        if (e.deltaY < 0) {
            this.zoomIn();
        } else {
            this.zoomOut();
        }
    }

    zoomIn() {
        this.zoom = Math.min(this.zoom + this.zoomStep, this.maxZoom);
        this.updateImageTransform();
    }

    zoomOut() {
        this.zoom = Math.max(this.zoom - this.zoomStep, this.minZoom);
        this.updateImageTransform();
    }

    resetZoom() {
        this.zoom = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateImageTransform();
    }

    updateImageTransform() {
        this.image.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoom})`;
    }

    startDrag(e) {
        // 只在图片被放大时允许拖拽，且不能是其他元素（如按钮）点击
        if (this.zoom <= 1 || e.target !== this.image) return;
        
        this.isDragging = true;
        this.dragStartX = e.clientX - this.translateX;
        this.dragStartY = e.clientY - this.translateY;
        this.image.style.cursor = 'grabbing';
    }

    handleDrag(e) {
        if (!this.isDragging || this.zoom <= 1) return;
        
        this.translateX = e.clientX - this.dragStartX;
        this.translateY = e.clientY - this.dragStartY;
        
        // 限制拖拽范围
        const maxTranslate = (this.zoom - 1) * 100;
        this.translateX = Math.max(-maxTranslate, Math.min(maxTranslate, this.translateX));
        this.translateY = Math.max(-maxTranslate, Math.min(maxTranslate, this.translateY));
        
        this.updateImageTransform();
    }

    endDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.image.style.cursor = 'grab';
        }
    }

    handleTouchStart(e) {
        if (e.touches.length === 2) {
            this.touchStartDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
            this.touchStartZoom = this.zoom;
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 2) {
            const currentDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
            const scale = currentDistance / this.touchStartDistance;
            this.zoom = Math.min(Math.max(this.touchStartZoom * scale, this.minZoom), this.maxZoom);
            this.updateImageTransform();
        }
    }

    handleTouchEnd() {
        this.touchStartDistance = 0;
        this.touchStartZoom = this.zoom;
    }

    getTouchDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetZoom();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setProcessing(state) {
        this.isProcessing = state;
    }
}
