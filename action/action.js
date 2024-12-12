const moviesContainer = document.getElementById("movies"); // Assuming this is the container for your cards.
const API_KEY = "8afda1c4a556a9bd6b01d0e877f42929";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";


async function fetchActionMovies() {
  try {
    // Fetch movies with Action genre (ID: 28)
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`
    );
    const data = await response.json();

    // Populate cards with fetched movie data
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching action movies:", error);
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = ""; // Clear previous content
  movies.forEach((movie) => {
    // Create a movie card for each movie
    const movieCard = document.createElement("div");
    movieCard.classList.add(
      "w-[20%]",
      "rounded",
      "shadow-lg",
        "bg-black",
        "opacity-90",
      "h-full",
      
      "m-4"
    );

    movieCard.innerHTML = `
      <img
        class="w-full h-[30%] object-cover rounded-t-lg"
        src="${IMAGE_BASE_URL}${movie.poster_path}"
        alt="${movie.title}"
      />
      <div class="px-6 py-4 h-[200px] overflow-y-scroll">
        <div class="font-bold text-xl mb-2">${movie.title}</div>
        <p class="text-gray-400 text-base">
          ${movie.overview || "No description available."}
        </p>
      </div>
      <div class="px-6 pt-4 pb-2">
        <span
          class="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-400 mr-2 mb-2"
        >
          #${movie.genre_ids.includes(28) ? "Action" : "Other"}
        </span>
        <span
          class="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-400 mr-2 mb-2"
        >
          #${movie.vote_average.toFixed(1)} Rating
        </span>
        <span
          class="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-400 mr-2 mb-2"
        >
          #${movie.release_date ? movie.release_date.split("-")[0] : "Unknown"}
        </span>
      </div>
    `;

    // Append the card to the container
    moviesContainer.appendChild(movieCard);
  });
}

// Fetch and display action movies
fetchActionMovies();
