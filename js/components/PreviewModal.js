class PreviewModal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.image = this.modal.querySelector('#modal-image');
        this.closeBtn = this.modal.querySelector('#modal-close');
        this.info = this.modal.querySelector('#modal-info');
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.close();
            }
        });
    }

    open(src, file, index, total) {
        if (this.isProcessing) return;
        this.image.src = src;
        this.info.textContent = `图片 ${index + 1}/${total} | ${file.name} | ${this.formatFileSize(file.size)}`;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
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
