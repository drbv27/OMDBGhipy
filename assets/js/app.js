document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const movieTitleInput = document.getElementById("movieTitle");
    const movieInfoDiv = document.getElementById("movieInfo");
    const imageContainer = document.getElementById("imageContainer");
    const historyList = document.getElementById("historyList");
    const historyModal = document.getElementById("historyModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    const historyButton = document.getElementById("historyButton");
  
    // Event listener for search button
    searchButton.addEventListener("click", async () => {
      const movieTitle = movieTitleInput.value;
      if (movieTitle) {
        try {
          // Fetch movie information from OMDB API
          const omdbResponse = await fetch(`https://www.omdbapi.com/?t=${movieTitle}&apikey=423457B5`);//THIS KEY IS MY PERSONAL KEY
          const omdbData = await omdbResponse.json();
          console.log(omdbData)
  
          // Fetch Giphy images
          const giphyResponse = await fetch(`https://api.giphy.com/v1/gifs/search?q=${movieTitle}&api_key=rdXGkYvUih1yJcx80s79MnXiBeWmBTEM&limit=5`);//THIS KEY IS MY PERSONAL KEY
          const giphyData = await giphyResponse.json();
  
          // Display movie information
          movieInfoDiv.innerHTML = `
          <div class="flex flex-col items-center">
            <h2 class="text-xl font-semibold">OMDB: ${omdbData.Title}</h2>
            <p><span class="font-bold">Year:</span> ${omdbData.Year}</p>

            <img src="${omdbData.Poster}" alt="Movie Poster" class="w-1/4">
        </div>
            <p><span class="font-bold">Plot:</span> ${omdbData.Plot}</p>
            <p><span class="font-bold">Cast:</span> ${omdbData.Actors}</p>
            <p><span class="font-bold">Director:</span> ${omdbData.Director}</p>
            <p><span class="font-bold">Genre:</span> ${omdbData.Genre}</p>
            <p><span class="font-bold">IMDB Rating:</span> ${omdbData.imdbRating}</p>
            <p><span class="font-bold">IMDB Votes:</span> ${omdbData.imdbVotes}</p>
            <p><span class="font-bold">Rated:</span> ${omdbData.Rated}</p>
            <p><span class="font-bold">Runtime:</span> ${omdbData.Runtime}</p>
            <p><span class="font-bold">Box Office:</span> ${omdbData.BoxOffice}</p>
          `;
  
          // Display Giphy images
          imageContainer.innerHTML = "<h2 class='text-xl font-semibold'>Giphy Images</h2>";
          giphyData.data.forEach(gif => {
            const imageElement = document.createElement("img");
            imageElement.src = gif.images.fixed_height.url;
            imageElement.alt = "Movie GIF";
            imageElement.classList.add("w-full", "mb-4");
            imageContainer.appendChild(imageElement);
          });
  
          // Add search to search history
          addToHistory(movieTitle);
  
        } catch (error) {
          console.error("Error fetching data:", error);
          movieInfoDiv.innerHTML = "Error fetching data.";
        }
      }
    });
  
    // Event listener to close modal
    closeModalButton.addEventListener("click", () => {
      historyModal.classList.add("hidden");
    });
  
    // Event listener to clear search history
    clearHistoryButton.addEventListener("click", () => {
      localStorage.removeItem("searchHistory");
      loadHistory();
    });
  
    // Event listener for individual history item removal
    historyList.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-history")) {
        const searchQuery = event.target.getAttribute("data-query");
        removeHistoryItem(searchQuery);
      }
    });
  
    // Function to add search to history
    function addToHistory(searchQuery) {
      const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      if (!history.includes(searchQuery)) {
        history.push(searchQuery);
        localStorage.setItem("searchHistory", JSON.stringify(history));
        loadHistory();
      }
    }
  
    // Function to load and display search history
    function loadHistory() {
      const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      historyList.innerHTML = "";
      history.forEach(searchQuery => {
        const searchItem = document.createElement("li");
        searchItem.textContent = searchQuery;
        searchItem.classList.add("cursor-pointer", "hover:underline");
        searchItem.addEventListener("click", () => {
          movieTitleInput.value = searchQuery;
          searchButton.click();
        });
        historyList.appendChild(searchItem);
      });
    }
  
    // Function to remove individual history item
    function removeHistoryItem(searchQuery) {
      const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      const updatedHistory = history.filter(query => query !== searchQuery);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      loadHistory();
    }
  
    // Event listener for history modal
    historyButton.addEventListener("click", () => {
      historyModal.classList.remove("hidden");
    });
  
    // Load search history on page load
    loadHistory();
  });
  