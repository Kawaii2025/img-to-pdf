class ControlPanel {
    constructor(convertBtnId, clearBtnId, callbacks) {
        this.convertBtn = document.getElementById(convertBtnId);
        this.clearBtn = document.getElementById(clearBtnId);
        this.callbacks = callbacks;
        this.init();
    }

    init() {
        this.convertBtn.addEventListener('click', () => this.callbacks.onConvert());
        this.clearBtn.addEventListener('click', () => this.callbacks.onClear());
    }

    setAllDisabled(state) {
        this.convertBtn.disabled = state;
        this.clearBtn.disabled = state;
    }
}
