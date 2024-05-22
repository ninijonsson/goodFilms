const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

// För att kunna sortera
let movieTitles = [];
let movieReleases = [];
let movieRatings = [];

const wrapper = document.getElementById("wrapper");

wrapper.innerHTML = `
    <h1 id="title">MOVIE RESULTS</h1>
    <hr>
    <select name="sortBy">
        <option>SORT BY</option>
        <option value="titleAsc">TITLE: ASC.</option>
        <option value="titleDesc">TITLE: DESC.</option>
        <option value="releaseDateLatest">RELEASE DATE: LATEST</option>
        <option value="releaseDateOldest">RELEASE DATE: OLDEST</option>
        <option value="ratingHighest">RATING: HIGHEST TO LOWEST</option>
        <option value="ratingLowest">RATING: LOWEST TO HIGHEST</option>
    </select>

    <div id="moviesContainer"></div>
`;

// Implementera "view more"?

if (window.localStorage.getItem("movieQuery")) {
    let query = window.localStorage.getItem("movieQuery");
    console.log(query);
    const response = await fetch(query, options);
    const filteredMovies = await response.json();

    const moviesContainer = document.getElementById("moviesContainer");

    for (let i = 0; i < 20; i++) {
        console.log(filteredMovies.results[i]);
        if (filteredMovies.results[i] === undefined) {
            continue;
        }

        if (filteredMovies.results[i].poster_path !== null) {
            moviesContainer.innerHTML += `
                <img class="movie" id="${filteredMovies.results[i].id}" src="https://image.tmdb.org/t/p/original/${filteredMovies.results[i].poster_path}">
            `;
        }
    }

    let sortOptions = document.querySelectorAll("select[name='sortBy'] option");

    sortOptions.forEach(option => {
        option.addEventListener("click", (event) => {
            const sortBy = event.target.value;

            for (let i = 0; i < filteredMovies.results.length; i++) {
                movieTitles.push(filteredMovies.results[i].title);
                movieReleases.push(filteredMovies.results[i].release_date);
                movieRatings.push(filteredMovies.results[i].vote_average);
            }

            switch (sortBy) {
                case "titleAsc":
                    // Sorterar i bokstavsordning
                    movieTitles.sort();

                    findMovie(movieTitles, filteredMovies.results, "title");

                    // Tömmer arrayen när vi sorterar på nytt för att inte få dubletter
                    movieTitles = [];
                    break;

                case "titleDesc":
                    // Sorterar i omvänd bokstavsordning
                    movieTitles.sort().reverse();

                    findMovie(movieTitles, filteredMovies.results, "title");

                    // Tömmer arrayen när vi sorterar på nytt för att inte få dubletter
                    movieTitles = [];
                    break;

                case "releaseDateLatest":
                    // Sorterar i bokstavsordning
                    movieReleases.sort().reverse();

                    findMovie(movieReleases, filteredMovies.results, "release_date");

                    console.log(movieReleases);

                    // Tömmer arrayen när vi sorterar på nytt för att inte få dubletter
                    movieReleases = [];
                    break;

                case "releaseDateOldest":
                    // Sorterar i bokstavsordning
                    movieReleases.sort();

                    findMovie(movieReleases, filteredMovies.results, "release_date");

                    console.log(movieReleases);

                    // Tömmer arrayen när vi sorterar på nytt för att inte få dubletter
                    movieReleases = [];
                    break;

                case "ratingHighest":
                    // Sorterar i bokstavsordning
                    movieRatings.sort((a, b) => b - a);

                    findMovie(movieRatings, filteredMovies.results, "vote_average");

                    console.log(movieRatings);

                    // Tömmer arrayen när vi sorterar på nytt för att inte få dubletter
                    movieRatings = [];
                    break;

                case "ratingLowest":
                    // Sorterar i bokstavsordning
                    movieRatings.sort((a, b) => a - b);

                    findMovie(movieRatings, filteredMovies.results, "vote_average");

                    console.log(movieRatings);

                    // Tömmer arrayen när vi sorterar på nytt för att inte få dubletter
                    movieRatings = [];
                    break;
            }

        })
    });

    moviesContainer.addEventListener("click", async (event) => {
        console.log(event);
        if (event.target.classList.contains("movie")) {
            const movieId = event.target.id;

            window.localStorage.setItem("movieInfo", `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`);

            window.location = "../moviePage/index.html";
        }
    });
}

function findMovie(movies, filteredMovies, keyType) {
    const moviesContainer = document.getElementById("moviesContainer");

    // Reset filmerna som syns på sidan
    moviesContainer.innerHTML = null;

    for (let i = 0; i < 20; i++) {
        let foundMovie = filteredMovies.find((movie) => {
            if (movies[i] === movie[keyType]) {
                return movie;
            }
        })

        if (foundMovie) {
            moviesContainer.innerHTML += `
                <img class="movie" id="${foundMovie.id}" src="https://image.tmdb.org/t/p/original/${foundMovie.poster_path}">
            `;
        }
    }
}