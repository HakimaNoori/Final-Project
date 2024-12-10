const API_KEY = "8afda1c4a556a9bd6b01d0e877f42929";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies");

// Maximum number of pages to fetch
const MAX_PAGES = 40;

async function fetchMoviesByPage(page) {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
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
      <h3>${movie.title}</h3>
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
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
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