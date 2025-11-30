// ============================================
// FILE: js/app.js
// MAIN APPLICATION
// ============================================

class ImageToPdfApp {
    constructor() {
        this.imageFiles = [];
        this.isProcessing = false;
        this.initComponents();
        this.attachMainHandlers();
    }

    initComponents() {
        this.uploadArea = new UploadArea('drop-area', { 
            onDrop: (files) => this.handleFilesDrop(files) 
        });
        
        this.previewContainer = new PreviewContainer('preview-container', {
            onPreview: (file, idx) => this.previewImage(file, idx),
            onRemove: (idx) => this.removeImage(idx),
            onReorder: (fromIdx, toIdx) => this.reorderImages(fromIdx, toIdx)
        });
        
        this.progressBar = new ProgressBar('progress-container');
        
        this.modal = new PreviewModal('preview-modal');
        
        this.controls = new ControlPanel('convert-btn', 'clear-btn', {
            onConvert: () => this.convertToPdf(),
            onClear: () => this.clearAll()
        });
        
        this.loading = new LoadingIndicator('loading');
    }

    attachMainHandlers() {
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFilesDrop(e.target.files);
        });
    }

    async handleFilesDrop(files) {
        if (this.isProcessing) return;

        const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (imageFiles.length === 0) return;

        this.setProcessing(true);
        this.progressBar.show();

        for (let i = 0; i < imageFiles.length; i++) {
            this.progressBar.update(i, imageFiles.length);
            const file = imageFiles[i];
            const compressed = await this.compressImage(file);
            this.imageFiles.push(compressed);
            
            await this.previewContainer.addItem(compressed, this.imageFiles.length - 1, {
                onPreview: (f, idx) => this.previewImage(f, idx),
                onRemove: (idx) => this.removeImage(idx),
                onReorder: () => {}
            });
        }

        this.progressBar.update(imageFiles.length, imageFiles.length);
        setTimeout(() => {
            this.progressBar.hide();
            this.setProcessing(false);
        }, 500);
    }

    async compressImage(file) {
        try {
            const options = { 
                maxSizeMB: 1, 
                maxWidthOrHeight: 1920, 
                useWebWorker: true 
            };
            return await imageCompression(file, options);
        } catch {
            return file;
        }
    }

    previewImage(file, index) {
        this.modal.open(URL.createObjectURL(file), file, index, this.imageFiles.length);
    }

    removeImage(index) {
        if (this.isProcessing) return;
        this.imageFiles.splice(index, 1);
        this.refreshPreviewContainer();
        this.updateControlStates();
    }

    reorderImages(fromIdx, toIdx) {
        const file = this.imageFiles[fromIdx];
        this.imageFiles.splice(fromIdx, 1);
        this.imageFiles.splice(toIdx, 0, file);
        this.refreshPreviewContainer();
    }

    refreshPreviewContainer() {
        this.previewContainer.refreshItems(this.imageFiles, {
            onPreview: (f, idx) => this.previewImage(f, idx),
            onRemove: (idx) => this.removeImage(idx),
            onReorder: (from, to) => this.reorderImages(from, to)
        });
    }

    clearAll() {
        if (this.isProcessing) return;
        this.imageFiles = [];
        this.previewContainer.element.innerHTML = '';
        this.progressBar.hide();
        this.updateControlStates();
    }

    async convertToPdf() {
        if (this.imageFiles.length === 0) {
            alert('请先上传图片！');
            return;
        }

        this.setProcessing(true);
        this.loading.show();

        try {
            const pdfDoc = await PDFLib.PDFDocument.create();

            for (const imageFile of this.imageFiles) {
                const imageBytes = await this.readFileAsBuffer(imageFile);
                let image;

                if (['image/jpeg', 'image/jpg'].includes(imageFile.type)) {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else if (imageFile.type === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes);
                } else if (imageFile.type === 'image/webp') {
                    const pngData = await this.convertWebpToPng(imageFile);
                    image = await pdfDoc.embedPng(pngData);
                } else {
                    continue;
                }

                const { width, height } = image.scale(1);
                const page = pdfDoc.addPage([width, height]);
                page.drawImage(image, { x: 0, y: 0, width, height });
            }

            const pdfBytes = await pdfDoc.save();
            this.downloadFile(pdfBytes, '图片拼接.pdf', 'application/pdf');
        } catch (error) {
            console.error('PDF生成失败:', error);
            alert('生成PDF失败，请重试！');
        } finally {
            this.loading.hide();
            this.setProcessing(false);
        }
    }

    readFileAsBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    convertWebpToPng(file) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                canvas.toBlob(blob => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsArrayBuffer(blob);
                }, 'image/png');
            };
            img.src = URL.createObjectURL(file);
        });
    }

    downloadFile(bytes, fileName, mimeType) {
        const blob = new Blob([bytes], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    setProcessing(state) {
        this.isProcessing = state;
        this.uploadArea.setProcessing(state);
        this.previewContainer.setProcessing(state);
        this.modal.setProcessing(state);
        this.updateControlStates();
    }

    updateControlStates() {
        const isEmpty = this.imageFiles.length === 0;
        this.controls.setAllDisabled(this.isProcessing || isEmpty);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ImageToPdfApp();
});
