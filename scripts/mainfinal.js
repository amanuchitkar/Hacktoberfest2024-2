// Initialize AOS (Animate On Scroll)
AOS.init();

// Array containing contributors data
const contributors = contributors;

// Cache DOM elements
const searchbox = document.getElementById("search");
const contributorsContainer = document.getElementById("contributors");
const loadMoreBtn = document.getElementById("loadMore");
const backToTopButton = document.querySelector("#back-to-top-btn");
let initialContributorsNumber = 72;

// Get and set the current year dynamically
const currentYear = new Date().getFullYear();
setCurrentYear();

/**
 * Sets the current year in the HTML elements.
 */
function setCurrentYear() {
  const yearElements = [
    { id: "current-year-title", defaultValue: currentYear },
    { id: "current-year-footer", defaultValue: currentYear },
    { id: "current-year-copyright", defaultValue: currentYear },
  ];

  yearElements.forEach((element) => {
    const el = document.getElementById(element.id);
    if (el) el.textContent = element.defaultValue;
    else console.warn(`Element with ID '${element.id}' not found in the DOM.`);
  });

  // Set document title with the current year
  document.title = `Hacktoberfest ${currentYear} - Contributors`;
}

/**
 * Filters contributors based on the search string.
 * @param {string} str - The search string.
 * @param {Array} array - The array of contributors.
 * @returns {Array} - The filtered list of contributors.
 */
function filterUsers(str = "", array) {
  const inputString = str.trim().toLowerCase();
  if (inputString === "") return array;
  return array.filter((item) => {
    const fullName = item.fullname || "";
    return fullName.toLowerCase().includes(inputString);
  });
}

/**
 * Creates a contributor element.
 * @param {Object} item - The contributor object.
 * @returns {HTMLElement} - The contributor link element.
 */
function createContributorElement(item) {
  const username = document.createElement("span");
  username.textContent = item.fullname;

  const user = document.createElement("a");
  user.className = "box-item";
  user.href = item.username;
  user.id = item.id;
  user.append(username);
  user.innerHTML += `<img loading="lazy" src="https://github.com/${item.username}.png">`;

  return user;
}

/**
 * Renders contributors on the page.
 * @param {Array} array - The array of contributors to render.
 */
function render(array) {
  contributorsContainer.innerHTML = ""; // Clear previous content
  array.forEach((item) => {
    if (item.id <= initialContributorsNumber) {
      contributorsContainer.append(createContributorElement(item));
    }
  });
}

// Initial render of contributors
render(contributors);

/**
 * Loads more contributors when the "Load More" button is clicked.
 */
function loadMore() {
  if (initialContributorsNumber >= contributors.length) return;

  initialContributorsNumber += 84;
  contributorsContainer.innerHTML = "<div class='text-center' id='loading'>Loading...</div>";
  
  setTimeout(() => {
    render(contributors);
    document.getElementById("loading").setAttribute("hidden", true);
    
    if (initialContributorsNumber >= contributors.length) {
      loadMoreBtn.setAttribute("hidden", true);
    }
  }, 500); // Simulate loading delay
}

loadMoreBtn.addEventListener("click", loadMore);

/**
 * Handles the search functionality.
 */
searchbox.addEventListener("keyup", async (e) => {
  const searchTerm = e.target.value;
  const searchResult = filterUsers(searchTerm, contributors);

  if (searchTerm !== "") {
    loadMoreBtn.classList.add("hidden");
    contributorsContainer.innerHTML = "<div class='text-center' id='loading'>Loading...</div>";
  } else {
    loadMoreBtn.classList.remove("hidden");
  }

  setTimeout(() => {
    contributorsContainer.innerHTML = "";
    render(searchResult);
    document.getElementById("loading").setAttribute("hidden", true);
  }, 500); // Simulate loading delay
});

/* Back-to-top button functionality */
window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
  if (window.pageYOffset > 300) {
    if (!backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnExit");
      backToTopButton.classList.add("btnEntrance");
      backToTopButton.style.display = "block";
    }
  } else {
    if (backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnEntrance");
      backToTopButton.classList.add("btnExit");
      setTimeout(() => {
        backToTopButton.style.display = "none";
      }, 250);
    }
  }
}

backToTopButton.addEventListener("click", smoothScrollBackToTop);

function smoothScrollBackToTop() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;

  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t + b;
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
}

// Toggle dark/light theme
$(".tdnn").click(function () {
  $("body").toggleClass("light");
  $(".moon").toggleClass("sun");
  $(".tdnn").toggleClass("day");
});

// Display live stats with the dynamic year
document.getElementById("stats").innerHTML = `You guys are awesome, we have again passed the GitHub rate limit this hour. <a href="https://github.com/fineanmol/Hacktoberfest${currentYear}" target="_blank">Here</a> is a link to check out our repo's live stats.`;
