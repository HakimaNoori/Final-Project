const API_KEY = "8afda1c4a556a9bd6b01d0e877f42929";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies");

// Maximum number of pages to fetch
const MAX_PAGES = 40;
const SCIENCE_FICTION_GENRE_ID = 878; // Genre ID for Science Fiction

async function fetchMoviesByPage(page) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    const data = await response.json();

    // Filter movies that belong to the Science Fiction genre
    const scienceFictionMovies = data.results.filter((movie) =>
      movie.genre_ids.includes(SCIENCE_FICTION_GENRE_ID)
    );

    return scienceFictionMovies;
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

    console.log("Fetched Science Fiction movies:", allMovies);
    displayMovies(allMovies);
  } catch (error) {
    console.error("Error fetching all movies:", error);
    moviesContainer.innerHTML = `<p>Failed to load movies. Please try again later.</p>`;
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = "";
  if (movies.length === 0) {
    moviesContainer.innerHTML = `<p>No science fiction movies found.</p>`;
  } else {
    movies.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie");
      movieElement.innerHTML = `
        <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
        <h3 style="font-family:sans-serif;color:white;">${movie.title}</h3>
      `;
      moviesContainer.appendChild(movieElement);
    });
  }
}

// Fetch and display all Science Fiction movies
fetchAllMovies();
