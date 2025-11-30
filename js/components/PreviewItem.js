class PreviewItem {
    constructor(file, index, callbacks) {
        this.file = file;
        this.index = index;
        this.callbacks = callbacks;
        this.element = null;
        this.isProcessing = false;
    }

    async render() {
        const imageData = await this.readFile();
        
        this.element = document.createElement('div');
        this.element.className = 'preview-item';
        this.element.dataset.index = this.index;
        this.element.draggable = !this.isProcessing;

        this.element.innerHTML = `
            <div class="order-number">${this.index + 1}</div>
            <img src="${imageData}" alt="preview">
            <div class="preview-overlay">点击查看大图</div>
            <button class="remove-btn" data-index="${this.index}" ${this.isProcessing ? 'disabled' : ''}>×</button>
        `;

        this.attachEvents();
        return this.element;
    }

    readFile() {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(this.file);
        });
    }

    attachEvents() {
        const img = this.element.querySelector('img');
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            this.callbacks.onPreview(this.file, this.index);
        });

        const removeBtn = this.element.querySelector('.remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this.isProcessing) {
                this.callbacks.onRemove(this.index);
            }
        });
    }

    setProcessing(state) {
        this.isProcessing = state;
        if (this.element) {
            this.element.draggable = !state;
            const removeBtn = this.element.querySelector('.remove-btn');
            if (removeBtn) removeBtn.disabled = state;
        }
    }
}
