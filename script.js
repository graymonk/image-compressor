document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const controlsArea = document.getElementById('controlsArea');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalFile = null;

    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', () => fileInput.click());

    // 处理文件拖拽
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // 处理质量滑块变化
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalFile) compressImage(originalFile);
    });

    // 处理文件
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件！支持的格式：PNG、JPG、JPEG、GIF');
            return;
        }
        
        // 添加文件大小限制
        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('图片大小不能超过10MB！');
            return;
        }

        originalFile = file;
        controlsArea.style.display = 'block';
        previewArea.style.display = 'block';

        // 添加加载提示
        originalPreview.src = '';
        compressedPreview.src = '';
        originalSize.textContent = '加载中...';
        compressedSize.textContent = '处理中...';

        // 显示原始图片
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalSize.textContent = `文件大小：${formatFileSize(file.size)}`;
            compressImage(file);
        };
        reader.onerror = () => {
            alert('读取文件失败，请重试！');
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 保持原始尺寸
                canvas.width = img.width;
                canvas.height = img.height;

                // 绘制图片
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 压缩
                const quality = qualitySlider.value / 100;
                const compressedDataUrl = canvas.toDataURL(file.type, quality);

                // 显示压缩后的图片
                compressedPreview.src = compressedDataUrl;

                // 计算压缩后的大小
                const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
                document.getElementById('compressedSize').textContent = 
                    `文件大小：${formatFileSize(compressedSize)}`;

                // 设置下载按钮
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = `compressed_${file.name}`;
                    link.href = compressedDataUrl;
                    link.click();
                };
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 