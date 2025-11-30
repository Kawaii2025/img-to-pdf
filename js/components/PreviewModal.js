class PreviewModal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.image = this.modal.querySelector('#modal-image');
        this.closeBtn = this.modal.querySelector('#modal-close');
        this.prevBtn = this.modal.querySelector('#modal-prev');
        this.nextBtn = this.modal.querySelector('#modal-next');
        this.info = this.modal.querySelector('#modal-info');
        this.isProcessing = false;
        
        // 追踪当前图片信息
        this.currentIndex = 0;
        this.totalImages = 0;
        this.allFiles = [];
        this.onNavigate = null;
        
        this.init();
    }

    init() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.prevBtn.addEventListener('click', () => this.showPrevious());
        this.nextBtn.addEventListener('click', () => this.showNext());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'flex') {
                if (e.key === 'Escape') this.close();
                if (e.key === 'ArrowLeft') this.showPrevious();
                if (e.key === 'ArrowRight') this.showNext();
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
        };
        reader.readAsDataURL(file);
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
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
