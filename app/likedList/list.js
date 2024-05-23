import { PubSub } from "../../global/logic/PubSub.js";
import { STATE } from "../../state.js";
import { fetcher } from "../../global/logic/fetcher.js"
import { options } from "../../state.js";
import { token } from "../../state.js";

PubSub.subscribe({
    event: "renderLikedList",
    listener: (detail) => renderLikedList(detail)
});

async function renderLikedList(parentID) {
    const userRequest = new Request(`../../api/users.php?user=${token}`, options);
    const user = await STATE.get("user", userRequest);

    const wrapper = document.getElementById(parentID);

    wrapper.innerHTML = `
    <h1 id="showAll">SHOW ALL LIKED</h1>

    <hr>

    <div id="moviesContainer"></div>
`;

    const moviesContainer = document.getElementById("moviesContainer");

    let fetchPromises = [];

    for (let i = 0; i < user.liked.length; i++) {
        const request = new Request(`https://api.themoviedb.org/3/movie/${user.liked[i]}?language=en-US`, options);

        // STATE.get()?
        fetchPromises.push(
            fetcher(request)
        );
    }

    const results = await Promise.all(fetchPromises);

    for (let i = 0; i < results.length; i++) {
        const movie = await results[i];

        if (movie === undefined) {
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
}

renderLikedList("wrapper");