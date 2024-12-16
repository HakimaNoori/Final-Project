const API_KEY = "8afda1c4a556a9bd6b01d0e877f42929";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const moviesContainer = document.getElementById("movies");
  const paginationDiv = document.getElementById("pagination");

  if (!moviesContainer || !paginationDiv) {
    console.error(
      'Error: The "movies" or "pagination" container element is missing in the HTML.'
    );
    return; // Exit if any required container is not found
  }

  let totalPages = 5; // Total number of pages
  const itemsPerPage = 20; // Number of items per page
  let currentPage = 1; // Current page number

  async function getMoviesByPage(page) {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Update totalPages from API

      return data.results;
    } catch (error) {
      console.error(`Error fetching movies for page ${page}:`, error);
      return [];
    }
  }

  async function getMovies() {
    try {
      const movies = await getMoviesByPage(currentPage);
      displayMovies(movies);
      renderPagination(); // Re-render pagination when new movies are loaded
    } catch (error) {
      console.error("Error fetching all movies:", error);
      moviesContainer.innerHTML =
        "<p>Failed to load movies. Please try again later.</p>";
    }
  }

  function displayMovies(movies) {
    moviesContainer.innerHTML = ""; // Clear previous movies
    movies.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie-card");
      movieElement.innerHTML = `
        <img class="movie-poster" src="${IMAGE_BASE_URL}${
        movie.poster_path || "default_image.jpg"
      }" alt="${movie.title || "No Title Available"}">
        <div class="movie-info">
          <h2 class="movie-title">${movie.title || "No Title Available"}</h2>
          <div class="movie-details">
            <div class="movie-imdb">
              <img style="float:right;width:23px;height:23px;" loading="lazy" src="https://starkmovie.af/wp-content/themes/toroflix/public/img/cnt/imdb1.svg" alt="img" data-lazy-src="https://starkmovie.af/wp-content/themes/toroflix/public/img/cnt/imdb1.svg" data-ll-status="loaded" class="entered lazyloaded">
              <span class="movie-rating">${movie.vote_average || "N/A"}</span>
            </div>
            <span class="movie-year">${
              movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "N/A"
            }</span>
          </div>
        </div>
      `;

      moviesContainer.appendChild(movieElement);
    });
  }

  function renderPagination() {
    paginationDiv.innerHTML = ""; // Clear previous pagination

    // Only render pagination if there are multiple pages
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        console.log("i in pagination", i);
        const pageItem = document.createElement("div");
        pageItem.className = "page-item";

        const pageLink = document.createElement("a");
        pageLink.className = "page-link";
        pageLink.href = "#";
        pageLink.textContent = i;

        if (i === currentPage) {
          pageItem.classList.add("active");
        }

        pageLink.addEventListener("click", (e) => {
          e.preventDefault();
          currentPage = i; // Set the current page
          getMovies(); // Fetch and display movies for the new page
        });

        pageItem.appendChild(pageLink);
        paginationDiv.appendChild(pageItem);
      }
    }
  }

  // Initial rendering
  getMovies();
});
