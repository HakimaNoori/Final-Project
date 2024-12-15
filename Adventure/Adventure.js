const API_KEY = "8afda1c4a556a9bd6b01d0e877f42929";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies");

// Maximum number of pages to fetch
const MAX_PAGES = 20;

// Adventure genre ID from TMDb
const ADVENTURE_GENRE_ID = 12;

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

        // Filter movies by Adventure genre
        const adventureMovies = allMovies.filter(movie => movie.genre_ids.includes(ADVENTURE_GENRE_ID));

        console.log("Adventure movies:", adventureMovies);
        displayMovies(adventureMovies);
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



const popup = document.getElementById("popup");
const openPopupBtn = document.getElementById("open-popup");
const closePopupBtn = document.getElementById("close-btn");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const removeBtn = document.getElementById("remove-btn");

// Open popup
openPopupBtn.addEventListener("click", () => {
    popup.classList.remove("hidden");
});

// Close popup
closePopupBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
});

// Search functionality
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();
    const movieElements = document.querySelectorAll(".movie");
    movieElements.forEach(movie => {
        const title = movie.querySelector("h3").innerText.toLowerCase();
        if (!title.includes(query)) {
            movie.style.display = "none";
        } else {
            movie.style.display = "block";
        }
    });
    popup.classList.add("hidden");
});
