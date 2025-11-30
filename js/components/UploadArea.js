class UploadArea {
    constructor(containerId, callbacks) {
        this.element = document.getElementById(containerId);
        this.fileInput = this.element.querySelector('#file-input');
        this.callbacks = callbacks;
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.element.addEventListener('click', () => this.onClick());
        this.setupDragAndDrop();
    }

    onClick() {
        if (!this.isProcessing) {
            this.fileInput.click();
        }
    }

    setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.element.addEventListener(eventName, (e) => e.preventDefault());
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.element.addEventListener(eventName, () => this.highlight());
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.element.addEventListener(eventName, () => this.unhighlight());
        });

        this.element.addEventListener('drop', (e) => this.callbacks.onDrop(e.dataTransfer.files));
    }

    highlight() {
        if (!this.isProcessing) {
            this.element.style.borderColor = '#2196F3';
            this.element.style.backgroundColor = '#e3f2fd';
        }
    }

    unhighlight() {
        this.element.style.borderColor = '#ccc';
        this.element.style.backgroundColor = 'white';
    }

    setProcessing(state) {
        this.isProcessing = state;
        this.element.classList.toggle('disabled', state);
        this.fileInput.disabled = state;
    }
}
