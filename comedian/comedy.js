const API_KEY = "8afda1c4a556a9bd6b01d0e877f42929";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies");

const MAX_PAGES = 10;
const COMEDY_GENRE_ID = 35;

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

    const comedianMovies = allMovies.filter(movie => movie.genre_ids.includes(COMEDY_GENRE_ID));

    console.log("Fetched comedian movies:", comedianMovies);
    displayMovies(comedianMovies);
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

    movieElement.addEventListener("click", () => openMovieModal(movie));
    moviesContainer.appendChild(movieElement);
  });
}

function openMovieModal(movie) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
      <h2>${movie.title}</h2>
      <p>${movie.overview || "No description available."}</p>
      <p><strong>Original Title:</strong> ${movie.original_title || "N/A"}</p>
      <p><strong>Language:</strong> ${movie.original_language.toUpperCase() || "N/A"}</p>
      <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
      <p><strong>Genres:</strong> ${movie.genre_ids.join(", ") || "N/A"}</p>
      <p><strong>Popularity:</strong> ${movie.popularity.toFixed(2) || "N/A"}</p>
      <p><strong>Rating:</strong> ${movie.vote_average || "N/A"}/10</p>
      <p><strong>Votes:</strong> ${movie.vote_count || 0}</p>
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector(".close-button");
  closeButton.addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
}

function closeModal(modal) {
  document.body.removeChild(modal);
}

// Adding css styles for modal
const style = document.createElement("style");
style.textContent = `
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: rgb(206, 296, 260);
    padding: 0px;
    border-radius: 7px;
    max-width: 400px;
    text-align: center;
    position: relative;
    height:500px
    // background:rgb(246, 246, 240);
  }
  .modal-content img {
    width: 100%;
    border-radius: 8px;
    height:210px;
    margin-bottom: 10px;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    cursor: pointer;
  }
    .modal-content p{
    font-size:10px;
    }
`;

document.head.appendChild(style);
fetchAllMovies();
