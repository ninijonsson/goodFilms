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

async function getMovies() {
    const response = await fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options);
    const resource = await response.json();

    return resource;
}

const movies = await getMovies();

const wrapper = document.getElementById("wrapper");

wrapper.innerHTML = `
    <h1 id="showAll">SHOW ALL WATCHED</h1>

    <hr>

    <div id="moviesContainer"></div>
`;

// Kontrollera token

const moviesContainer = document.getElementById("moviesContainer");

console.log(movies.results);

for (let i = 0; i < movies.results.length; i++) {
    moviesContainer.innerHTML += `
        <img class="movie" id="${movies.results[i].id}" src="https://image.tmdb.org/t/p/original/${movies.results[i].poster_path}">
    `;
}

// För att klicka in på filmerna
moviesContainer.addEventListener("click", async (event) => {
    console.log(event);
    if (event.target.classList.contains("movie")) {
        const movieId = event.target.id;

        window.localStorage.setItem("movieInfo", `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`);

        window.location = "../moviePage/index.html";
    }
});