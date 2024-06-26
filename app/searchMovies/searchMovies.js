import { PubSub } from "../../global/logic/PubSub.js"
import { STATE } from "../../state.js";
import { options } from "../../state.js";
import { token } from "../../state.js";

PubSub.subscribe({
    event: "renderSearchMovies",
    listener: (detail) => renderSearchMovies(detail)
})

async function renderSearchMovies(parentID) {
    const parent = document.getElementById(parentID);

    const moviesRequest = new Request("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options);
    const movies = await STATE.get("trendingMovies", moviesRequest);

    parent.innerHTML = `
        <div id="searchContainer">
            <input type="text" name="searchMovie" placeholder="SEARCH FOR MOVIE">
            <p>BROWSE BY</p>
            <select name="genre">
                <option>GENRE</option>
            </select>

            <select name="year">
                <option>YEAR</option>
            </select>
        </div>

        <h1 id="trendingTitle">WHAT'S TRENDING?</h1>
        <hr>

        <div id="moviesContainer">
        </div>
    `;

    // Sök på en film
    const inputSearchMovie = document.querySelector("input[name='searchMovie']");

    // Fixa "loading screen"
    inputSearchMovie.addEventListener("keypress", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();

            const movieInput = event.target.value.toLowerCase();

            const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieInput}&include_adult=false&language=en-US&page=1`, options);

            const movies = await response.json();

            // När vi sökt på filmen så sparar vi i localStorage för att gå till "movieResults"
            window.localStorage.setItem("movieQuery", `https://api.themoviedb.org/3/search/movie?query=${movieInput}&include_adult=false&language=en-US&page=1`);

            // Gå till filmsidan
            window.location = "../moviesResults/index.html";

            // Om "movies"-arrayen är tom, meddela användaren
            if (movies.length === 0) {
                window.alert("Movie not found.");
            }
        }
    })

    // Select "genre"
    const selectGenre = document.querySelector("select[name='genre']");

    const response = await fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options);
    const genresObject = await response.json();

    // För att hitta rätt ID på genre utifrån namnet
    // Flytta till global funktion?
    function findGenreIdByName(genres, genreName) {
        for (const genre of genres) {
            if (genre.name.toLowerCase() === genreName.toLowerCase()) {
                return genre.id; // Returnerar ID med rätt namn
            }
        }

        return null; // Om namnet inte finns
    }

    for (let i = 0; i < genresObject.genres.length; i++) {
        const option = document.createElement("option");

        option.textContent = genresObject.genres[i].name;
        option.value = genresObject.genres[i].name;

        selectGenre.appendChild(option);
    }

    let genreOptions = document.querySelectorAll("select[name='genre'] option");

    genreOptions.forEach(option => {
        option.addEventListener("click", async (event) => {
            window.localStorage.removeItem("movieQuery");
            let genre = findGenreIdByName(genresObject.genres, event.target.value);

            let span = `&with_genres=${genre}`;

            window.localStorage.setItem("movieQuery", `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1${span}`);

            window.location = "../moviesResults/index.html";
        })
    });

    // Select "year"
    const selectYear = document.querySelector("select[name='year']");

    let year = 1900;
    for (let i = 0; i < 13; i++) {
        const option = document.createElement("option");

        option.textContent = `${year}s`;
        option.value = year;

        year += 10;

        selectYear.appendChild(option);
    }

    let yearOptions = document.querySelectorAll("select[name='year'] option");

    yearOptions.forEach(option => {
        option.addEventListener("click", async (event) => {
            window.localStorage.removeItem("movieQuery");
            let year = parseInt(event.target.value);

            let endYear = year - 1;
            let startYear = year - 10;

            let span = `&release_date.gte=${String(startYear)}-01-01&release_date.lte=${String(endYear)}-12-31`;

            window.localStorage.setItem("movieQuery", `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1${span}`);

            // Fixa senare så länk funkar
            window.location = `../moviesResults/index.html?year=${year}s`;
        })
    });

    // Bilderna på filmerna
    const moviesContainer = document.getElementById("moviesContainer");

    for (let i = 0; i < 18; i++) {
        moviesContainer.innerHTML += `
            <img class="movie" id="${movies.results[i].id}" src="https://image.tmdb.org/t/p/original/${movies.results[i].poster_path}">
        `;
    }

    const movie = document.querySelectorAll(".movie");
    movie.forEach(movie => {
        movie.addEventListener("click", async (event) => {
            console.log(event.target.id);

            const movieId = event.target.id;

            window.localStorage.setItem("movieInfo", `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`);

            window.location = "../moviePage/index.html";
        })
    });
}