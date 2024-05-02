import { renderHeader } from "../header/header.js"
import { PubSub } from "../../logic/PubSub.js"

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};


/*

{
  "genres": [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
}

*/

renderHeader();

async function renderSearchMovies(parentID) {
    const parent = document.getElementById(parentID);

    const movies = await getMovies();

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

            <select name="director">
                <option>DIRECTOR</option>
            </select>
        </div>

        <h1 id="trendingTitle">WHAT'S TRENDING?</h1>
        <h3 id="allButton">ALL</h3>
        <hr>

        <div id="moviesContainer">
        </div>
    `;

    // Select "genre"
    const genre = document.querySelector("select[name='genre']");

    const response = await fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options);
    const genresObject = await response.json();

    for (let i = 0; i < genresObject.genres.length; i++) {
        const option = document.createElement("option");

        option.textContent = genresObject.genres[i].name;

        genre.appendChild(option);
    }

    // Bilderna på filmerna
    const moviesContainer = document.getElementById("moviesContainer");

    for (let i = 0; i < 9; i++) {
        moviesContainer.innerHTML += `
            <img class="movie" src="https://image.tmdb.org/t/p/original/${movies.results[i].poster_path}">
        `;
    }
}

async function getMovies() {
    fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    const response = await fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options);
    const resource = await response.json();

    return resource;
}

renderSearchMovies("wrapper");