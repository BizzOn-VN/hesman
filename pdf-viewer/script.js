const fileInput = document.getElementById('pdfUpload');
const outputDiv = document.getElementById('output');

// Tạo nút tải tất cả
const downloadAllBtn = document.createElement('button');
downloadAllBtn.textContent = "📦 Tải Tất Cả Trang (JPG ZIP)";
downloadAllBtn.style.margin = '20px auto';
downloadAllBtn.style.display = 'none';
downloadAllBtn.style.display = 'block';
downloadAllBtn.style.display = 'none';

// Tạo thanh tiến độ
const progress = document.createElement('p');
progress.style.fontWeight = 'bold';
progress.style.marginTop = '10px';

outputDiv.appendChild(progress);
outputDiv.appendChild(downloadAllBtn);

let imageDataList = [];

fileInput.addEventListener('change', async function () {
  const file = fileInput.files[0];
  if (!file || file.type !== 'application/pdf') return;

  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const typedArray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedArray).promise;

    imageDataList = [];
    progress.textContent = "⏳ Đang xử lý...";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const jpgData = canvas.toDataURL('image/jpeg', 1.0);
      imageDataList.push({ name: `page-${i}.jpg`, dataUrl: jpgData });

      // Cập nhật tiến độ
      const percent = Math.round((i / pdf.numPages) * 100);
      progress.textContent = `📄 Đang xử lý trang ${i}/${pdf.numPages} (${percent}%)...`;
    }

    progress.textContent = "✅ Xử lý hoàn tất!";
    downloadAllBtn.style.display = 'block';
  };

  fileReader.readAsArrayBuffer(file);
});

// Nút tải ZIP tất cả ảnh JPG
downloadAllBtn.addEventListener('click', async () => {
  const zip = new JSZip();
  imageDataList.forEach(img => {
    zip.file(img.name, img.dataUrl.split(',')[1], { base64: true });
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pdf-images.zip';
  a.click();
});