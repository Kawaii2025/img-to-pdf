class PreviewContainer {
    constructor(containerId, callbacks) {
        this.element = document.getElementById(containerId);
        this.callbacks = callbacks;
        this.items = [];
        this.draggedItem = null;
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.element.addEventListener('dragstart', (e) => this.handleDragStart(e));
        this.element.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.element.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        this.element.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.element.addEventListener('drop', (e) => this.handleDropItem(e));
        this.element.addEventListener('dragend', () => this.handleDragEnd());
    }

    async addItem(file, index, callbacks) {
        const item = new PreviewItem(file, index, callbacks);
        item.setProcessing(this.isProcessing);
        const element = await item.render();
        this.element.appendChild(element);
        this.items.push(item);
    }

    async refreshItems(files, callbacks) {
        this.element.innerHTML = '';
        this.items = [];
        for (let i = 0; i < files.length; i++) {
            await this.addItem(files[i], i, callbacks);
        }
    }

    handleDragStart(e) {
        if (this.isProcessing) return;
        if (e.target.closest('.preview-item')) {
            this.draggedItem = e.target.closest('.preview-item');
            this.draggedItem.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        if (this.isProcessing) return;
        const target = e.target.closest('.preview-item');
        if (target && target !== this.draggedItem) {
            target.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        const target = e.target.closest('.preview-item');
        if (target) target.classList.remove('drag-over');
    }

    handleDropItem(e) {
        if (this.isProcessing) return;
        e.preventDefault();

        const target = e.target.closest('.preview-item');
        if (!target || !this.draggedItem || target === this.draggedItem) return;

        const draggedIndex = parseInt(this.draggedItem.dataset.index);
        const targetIndex = parseInt(target.dataset.index);

        this.callbacks.onReorder(draggedIndex, targetIndex);
    }

    handleDragEnd() {
        if (this.draggedItem) {
            this.draggedItem.classList.remove('dragging');
        }
        document.querySelectorAll('.preview-item').forEach(item => {
            item.classList.remove('drag-over');
        });
        this.draggedItem = null;
    }

    setProcessing(state) {
        this.isProcessing = state;
        this.items.forEach(item => item.setProcessing(state));
    }

    isEmpty() {
        return this.items.length === 0;
    }
}
