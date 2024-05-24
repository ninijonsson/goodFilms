import { PubSub } from "./../global/logic/PubSub.js"
import { fetcher } from '../global/logic/fetcher.js';
import { options } from '../state.js';

PubSub.subscribe({
    event: "renderStart",
    listener: detail => renderLandingPage(detail)
});

async function getPopularMovies() {
    const rqst = new Request("https://api.themoviedb.org/3/movie/popular", options);
    const popularMovies = await fetcher(rqst);

    return popularMovies;
}

export async function renderLandingPage(parentID) {
    const DOM = document.getElementById(parentID);
    DOM.innerHTML = `
    <div id="top">
        <div id="logo">
            <img id="logoImg" src="../media/icons/logo.svg">
            <h1 id="logoFont">goodFilms</h1>
        </div>
        <p id="descriptionTxt">
            FIND THE NEXT&nbsp;<span id="goodest">GOODEST</span>&nbsp;&nbsp;FILM
        </p>
    </div>
    <hr id="topLine">
    <div id="middle">
        <button id="join">JOIN US NOW!</button>
        <h2>Already a member? <a id="logInLink" href="./logIn/">Log in</a></h2>
    </div>
    <hr id="middleLine">
    <div id="bottom">
        <h5>NEED A MOVIE TO WATCH? WE GOT YOU!</h6>
        <div id="popularMovies"></div>
        <h5>ALREADY SEEN THESE? <a id="searchMoreLink" href="">SEARCH FOR MORE</a></h6>
    </div>
    `;

    const joinBttn = document.getElementById("join");
    joinBttn.addEventListener("click", () => {
        window.location = "./register";
    });


    const movies = await getPopularMovies();

    const moviesContainer = document.getElementById("popularMovies");

    for (let i = 0; i < 6; i++) {
        moviesContainer.innerHTML += `
            <img class="movie" id="${movies.results[i].id}" src="https://image.tmdb.org/t/p/original/${movies.results[i].poster_path}">
        `;
    }

    // const movie = document.querySelectorAll(".movie");
    // movie.forEach(movie => {
    //     movie.addEventListener("click", async (event) => {
    //         console.log(event.target.id);

    //         const movieId = event.target.id;

    //         window.localStorage.setItem("movieInfo", `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`);

    //         window.location = "../../app/moviePage/index.html";
    //     })
    // });
}