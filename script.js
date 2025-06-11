const tapConfig = {
  tap1: { start: 1, end: 69, title: "Cuộc vợt ngục" },
  tap2: { start: 70, end: 120, title: "Kẻ phản bội" },
  tap3: { start: 121, end: 180, title: "Bí mật đại dương" }
};

let currentPage = 0;
let currentDataset = "tap1";

const imageView = document.getElementById("imageView");
const datasetSelect = document.getElementById("dataset");
const pageCounter = document.getElementById("pageCounter");

for (const tap in tapConfig) {
  const { title } = tapConfig[tap];
  const option = document.createElement("option");
  option.value = tap;
  option.textContent = `${tap.replace("tap", "Tập ")}: ${title}`;
  datasetSelect.appendChild(option);
}

function updateImage() {
  const { start, end } = tapConfig[currentDataset];
  const realPage = start + currentPage;
  const imgPath = `img/${currentDataset}/page-${realPage}.jpg`;
  imageView.src = imgPath;
  const pageText = `TRANG ${currentPage + 1}/${end - start + 1}`;
  pageCounter.textContent = pageText;
}

function nextPage() {
  const { start, end } = tapConfig[currentDataset];
  if (start + currentPage < end) {
    currentPage++;
    updateImage();
  }
}

function prevPage() {
  const { start } = tapConfig[currentDataset];
  if (start + currentPage > start) {
    currentPage--;
    updateImage();
  }
}

function changeDataset() {
  currentDataset = datasetSelect.value;
  currentPage = 0;
  updateImage();
}

let startX = 0;
document.querySelector(".image-area").addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
document.querySelector(".image-area").addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  if (Math.abs(diff) > 50) {
    if (diff < 0) nextPage();
    else prevPage();
  }
});

window.onload = () => {
  currentDataset = Object.keys(tapConfig)[0];
  datasetSelect.value = currentDataset;
  currentPage = 0;
  updateImage();
};