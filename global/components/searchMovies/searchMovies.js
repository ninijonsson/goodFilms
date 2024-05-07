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
        </div>

        <h1 id="trendingTitle">WHAT'S TRENDING?</h1>
        <h3 id="allButton">ALL</h3>
        <hr>

        <div id="moviesContainer">
        </div>
    `;

    // Select "genre"
    const selectGenre = document.querySelector("select[name='genre']");

    const response = await fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options);
    const genresObject = await response.json();

    // För att hitta rätt ID på genre utifrån namnet
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