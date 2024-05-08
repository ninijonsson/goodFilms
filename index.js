import { renderLandingPage } from "./start/start.js";

// GLOBAL COMPONENTS
import "./global/components/searchMovies/searchMovies.js"
import "./global/components/hamburgerMenu/hamburgerMenu.js"
import "./global/components/header/header.js"
import "./global/components/moviesResults/moviesResults.js"

// START COMPONENTS
import "./start/logIn/logIn.js"
import "./start/register/register.js"

renderLandingPage("wrapper");

// Test!
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E'
    }
};

fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options)
    .then(response => response.json())
    .then(response => {
        const wrapper = document.querySelector("body");

        wrapper.innerHTML = `
            <img class="movie" src="https://image.tmdb.org/t/p/original/${response.results[0].poster_path}">
        `;
    })
    .catch(err => console.error(err));