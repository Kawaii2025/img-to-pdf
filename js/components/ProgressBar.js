class ProgressBar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bar = this.container.querySelector('#progress-bar');
        this.text = this.container.querySelector('#progress-text');
        this.percentage = this.container.querySelector('#progress-percentage');
    }

    update(current, total) {
        const percent = Math.round((current / total) * 100);
        this.bar.style.width = `${percent}%`;
        this.text.textContent = `处理中: ${current}/${total}`;
        this.percentage.textContent = `${percent}%`;
    }

    show() {
        this.container.style.display = 'block';
    }

    hide() {
        this.container.style.display = 'none';
    }
}
