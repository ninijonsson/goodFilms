import { renderHeader } from "../../global/components/header/header.js"

// Gör om till global variabel
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

renderHeader();

const wrapper = document.getElementById("wrapper");

if (window.localStorage.getItem("movieInfo")) {
    let info = window.localStorage.getItem("movieInfo");
    const response = await fetch(info, options);
    const movie = await response.json();

    // För att fixa när production company är undefined
    let productionCompany = "";
    // Fixa när nycklar är undefined, t.ex. production company
    if (movie.production_companies[0] === undefined) {
        productionCompany = "MOVIE PRODUCTION";
    } else {
        productionCompany = movie.production_companies[0].name.toUpperCase();
    }

    // Till filmer som saknar backdrop posters
    let backdropPath = "";
    if (movie.backdrop_path === null) {
        backdropPath = "../../../media/icons/test.png"
        console.log(backdropPath);
        console.log(movie.backdrop_path);
    } else {
        backdropPath = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
    }

    wrapper.innerHTML = `
    <div id="movieContainer">
        <img id="backdropPoster" src="${backdropPath}">
        <div id="shadowOverlay"></div>

        <div id="movieInformationContainer">
            <h1 id="movieTitle">${movie.title} <span id="releaseYear">(${movie.release_date.slice(0, 4)})</span></h1>
            <h2 id="directedBy">PRODUCED BY ${productionCompany}</h2>
            <p id="movieDescription">${movie.overview}</p>
            <img id="moviePoster" src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
        </div>

        <div id="likedAndWatchedContainer">
            <img id="heartUnliked" src="">
            <button id="watchedButton" type="submit">WATCH</button>
        </div>

        <h3 id="similarMoviesText">SIMILAR MOVIES</h3>
        <hr>

        <div id="similarMoviesContainer"></div>
    </div>
    `;

    // Fixa filmer som saknar backdrop poster

    const similarMoviesContainer = document.getElementById("similarMoviesContainer");

    const responseSimilarMovies = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/similar?language=en-US&page=1`, options);
    const similarMovies = await responseSimilarMovies.json();

    let count = 0;
    for (let i = 0; i < similarMovies.results.length && count < 12; i++) {
        if (similarMovies.results[i].poster_path === null) {
            continue;
        }

        similarMoviesContainer.innerHTML += `
            <img class="movie" id="${similarMovies.results[i].id}" src="https://image.tmdb.org/t/p/original/${similarMovies.results[i].poster_path}">
        `;

        count++;
    }

    const movies = document.querySelectorAll(".movie");
    movies.forEach(movie => {
        movie.addEventListener("click", async (event) => {
            console.log(event.target.id);

            const movieId = event.target.id;

            window.localStorage.setItem("movieInfo", `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`);

            window.location = "index.html";
        })
    });
}

