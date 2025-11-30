class LoadingIndicator {
    constructor(loadingId) {
        this.element = document.getElementById(loadingId);
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
}
