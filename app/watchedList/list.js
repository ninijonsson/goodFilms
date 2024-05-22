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

// Test token
const token = "c62f39ace22172680875af13e02f6a6313ea1125";

async function getUser() {
    const response = await fetch(`../../api/users.php?user=${token}`);
    const user = await response.json();

    return user;
}

async function fetchMovie(i) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${user.watched[i]}?language=en-US`, options);
    const movie = await response.json();

    return movie;
}

const user = await getUser();

const wrapper = document.getElementById("wrapper");

wrapper.innerHTML = `
    <h1 id="showAll">SHOW ALL WATCHED</h1>

    <hr>

    <div id="moviesContainer"></div>
`;

// Kontrollera token

const moviesContainer = document.getElementById("moviesContainer");

for (let i = 0; i < user.watched.length; i++) {
    // Gör till Promise.all();
    const movie = await fetchMovie(i);

    // Vissa filmer saknar poster, skippa dem
    if (movie.poster_path === undefined) {
        continue;
    }

    moviesContainer.innerHTML += `
        <img class="movie" id="${movie.id}" src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
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