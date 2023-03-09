const searchForm = document.querySelector("form");
const searchInput = document.querySelector("#search");
const rankingSelect = document.querySelector("#ranking");
const tableBody = document.querySelector("tbody");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const pageNum = document.querySelector(".page-num");

const resultsPerPage = 150;
let currentPage = 1;
let currentResults = [];

// Fetch data from the results.json file
fetch("results.json")
  .then((response) => response.json())
  .then((data) => {
    currentResults = data;
    displayResults(currentResults, currentPage);
  })
  .catch((error) => console.error(error));

// Display the results in the table
function displayResults(results, page) {
  tableBody.innerHTML = "";
  const startIndex = (page - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);
  paginatedResults.forEach((result) => {
    const row = document.createElement("tr");
    const titleCell = document.createElement("td");
    const titleLink = document.createElement("a");
    titleLink.href = result.url;
    titleLink.textContent = result.title;
    titleCell.appendChild(titleLink);
    const urlCell = document.createElement("td");
    urlCell.textContent = result.url;
    const rankingCell = document.createElement("td");
    rankingCell.textContent = result.organic_ranking;
    row.appendChild(titleCell);
    row.appendChild(urlCell);
    row.appendChild(rankingCell);
    tableBody.appendChild(row);
  });
  const totalPages = Math.ceil(results.length / resultsPerPage);
  pageNum.textContent = `Page ${page} of ${totalPages}`;
  if (currentPage == 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }
  if (currentPage == totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}

// Handle form submission
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim().toLowerCase();
  const rankingFilter = rankingSelect.value.trim();
  let filteredResults = currentResults.filter((result) => {
    if (
      (result.title.toLowerCase().includes(searchTerm) ||
       result.url.toLowerCase().includes(searchTerm)) &&
      (rankingFilter === "" || result.organic_ranking == rankingFilter)
    ) {
      return true;
    } else {
      return false;
    }
  });
  currentPage = 1;
  displayResults(filteredResults, currentPage);
});

// Handle pagination
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayResults(currentResults, currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(currentResults.length / resultsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayResults(currentResults, currentPage);
  }
});


// get the export button element
const exportButton = document.getElementById('export');

// add a click event listener to the export button
exportButton.addEventListener('click', () => {
  // create a new file object with the filename and path
  const file = new File([""], "results.json", { type: "application/json" });
  // create a new URL object for the file
  const fileURL = URL.createObjectURL(file);
  // create a new anchor element to trigger the download
  const downloadLink = document.createElement("a");
  downloadLink.href = fileURL;
  downloadLink.download = "results.json";
  // simulate a click event on the download link
  downloadLink.click();
});


const feedback = document.getElementById("feedback");

// To show feedback message
function showFeedback(msg) {
  feedback.textContent = msg;
  feedback.style.display = "block";
}
