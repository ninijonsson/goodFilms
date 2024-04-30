// import { PubSub } from "../../logic/PubSub.js"

async function renderSearchMovies(parentID) {
    const parent = document.getElementById(parentID);

    const movies = await getMovies();

    parent.innerHTML = `
        <div id="searchContainer">
            <input type="text" name="searchMovie" placeholder="SEARCH FOR MOVIE">
        </div>

        <h1 id="trendingTitle">WHAT'S TRENDING?</h1>
        <h3 id="allButton">ALL</h3>
        <hr>

        <div id="moviesContainer">
        </div>
    `;

    const moviesContainer = document.getElementById("moviesContainer");

    for (let i = 0; i < 8; i++) {
        moviesContainer.innerHTML += `
            <img class="movie" src="https://image.tmdb.org/t/p/original/${movies.results[i].poster_path}">
        `;
    }
}

async function getMovies() {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
        }
    };

    fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    const response = await fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options);
    const resource = await response.json();

    return resource;
}

renderSearchMovies("wrapper");