const API_KEY = "8afda1c4a556a9bd6b01d0e877f42929";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const moviesContainer = document.getElementById("movies");
// Maximum number of pages to fetch
const MAX_PAGES = 40;

async function fetchMoviesByPage(page) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching movies for page ${page}:`, error);
    return [];
  }
}

async function fetchAllMovies() {
  try {
    moviesContainer.innerHTML = `<p>Loading...</p>`;
    let allMovies = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const movies = await fetchMoviesByPage(page);
      allMovies = allMovies.concat(movies);
    }

    console.log("Fetched movies:", allMovies);
    displayMovies(allMovies);
  } catch (error) {
    console.error("Error fetching all movies:", error);
    moviesContainer.innerHTML = `<p>Failed to load movies. Please try again later.</p>`;
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = "";
  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.innerHTML = `
      <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
      <h3 style="font-family:sans">${movie.title}</h3>
    `;
    moviesContainer.appendChild(movieElement);
  });
}

// Fetch and display all movies
fetchAllMovies();

// Search section

const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("search-box");

// Search for movies based on query
async function searchMovies(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    console.log("Search results:", data.results);
    displayMovies(data.results);
  } catch (error) {
    console.error("Error searching for movies:", error);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});
// Adding the comments section
document.addEventListener("DOMContentLoaded", function () {
  const comment = document.querySelector("#comment");
  const saveButton = document.querySelector("#saveButton");
  const removeButton = document.querySelector("#removeButton");
  const moviesContainer = document.querySelector("#comments");

  // Load saved comments from localStorage (if any)
  loadCommentsFromLocalStorage();

  // Save the comment
  saveButton.addEventListener("click", () => {
    const userComment = comment.value.trim(); // Get the value from textarea

    // Only save the comment if it's not empty
    if (userComment !== "") {
      const newList = document.createElement("li");
      newList.textContent = userComment;

      // Apply styles directly using JavaScript (replacing Tailwind classes)
      newList.style.border = "1px solid #000"; // border-gray-200
      newList.style.paddingTop = "0.5rem"; // py-2 (top padding)
      newList.style.paddingBottom = "0.5rem"; // py-2 (bottom padding)
      newList.style.listStyleType = "none"; // list-none (removes list bullets)
      newList.style.paddingLeft = "1.25rem"; // list-inside (moves the text inside the list)
      newList.style.marginBottom = "0.25rem";
      newList.style.borderRadius = "10px"; // Adds a small gap between list items (optional)

      // Optionally set the background color (for better visual)
      newList.style.backgroundColor = "#fff"; // or any other background color

      // Add the new list item to the movies container
      moviesContainer.appendChild(newList);

      // Save the comment to localStorage
      saveCommentToLocalStorage(userComment);

      // Optionally, clear the textarea after saving the comment
      comment.value = "";
    } else {
      alert("Please write a comment before saving.");
    }
  });

  // Remove the saved comment
  removeButton.addEventListener("click", () => {
    // Clear the comments from the DOM and localStorage
    moviesContainer.innerHTML = "";
    localStorage.removeItem("comments"); // Clear saved comments from localStorage
  });

  // Load comments from localStorage and display them
  function loadCommentsFromLocalStorage() {
    const savedComments = JSON.parse(localStorage.getItem("comments"));
    if (savedComments) {
      savedComments.forEach((commentText) => {
        const newList = document.createElement("li");
        newList.textContent = commentText;

        // Apply styles
        newList.style.border = "1px solid #e5e7eb";
        newList.style.paddingTop = "0.5rem";
        newList.style.paddingBottom = "0.5rem";
        newList.style.listStyleType = "none";
        newList.style.paddingLeft = "1.25rem";
        newList.style.marginBottom = "0.25rem";
        newList.style.backgroundColor = "#fff";

        // Add the list item to the movies container
        moviesContainer.appendChild(newList);
      });
    }
  }

  // Save the new comment to localStorage
  function saveCommentToLocalStorage(commentText) {
    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
    savedComments.push(commentText);
    localStorage.setItem("comments", JSON.stringify(savedComments));
  }
});
