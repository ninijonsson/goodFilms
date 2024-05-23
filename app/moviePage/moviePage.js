import { PubSub } from "../../global/logic/PubSub.js";
import { STATE } from "../../state.js";
// import { fetcher } from "../../global/logic/fetcher.js";
import { options } from "../../state.js";
import { token } from "../../state.js";

PubSub.subscribe({
    event: "renderMoviePage",
    listener: (detail) => renderMoviePage(detail)
});

async function getWatchedAndLiked(movieId) {
    const response = await fetch(`../../api/getInteraction.php?movieId=${movieId}`);

    const data = await response.json();

    return data;
}

async function renderMoviePage(parentID) {
    const wrapper = document.getElementById(parentID);

    if (window.localStorage.getItem("movieInfo")) {
        const userRequest = new Request(`../../api/users.php?user=${token}`, options);
        const user = await STATE.get("user", userRequest);

        let info = window.localStorage.getItem("movieInfo");
        const response = await fetch(info, options);
        const movie = await response.json();

        const data = await getWatchedAndLiked(movie.id);

        // Om filmerna inte finns i databasen, ska värdena vara 0
        // Annars blir dem "undefined"
        if (data.watched === undefined) {
            data.watched = 0;
        }

        if (data.liked === undefined) {
            data.liked = 0;
        }

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

            <div id="likedAndWatchedContainer">
                <div id="likedContainer">
                    <img class="heart" src="../../media/icons/unfilled_heart.png">
                    <p id="likedAmount">${data.liked}</p>
                </div>

                <div id="watchedContainer">
                    <img id="watchedEye" src="../../media/icons/eye.png">
                    <p id="watchedAmount">${data.watched}</p>
                </div>
            </div>

            <button id="watchedButton" type="submit">WATCH</button>
        </div>

        <h3 id="similarMoviesText">SIMILAR MOVIES</h3>
        <hr>

        <div id="similarMoviesContainer"></div>
    </div>
    `;

        const similarMoviesContainer = document.getElementById("similarMoviesContainer");

        const similarRequest = new Request(`https://api.themoviedb.org/3/movie/${movie.id}/similar?language=en-US&page=1`, options);

        const similarMovies = await STATE.get("similarMovies", similarRequest);

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

        // Klick-event för "like"
        const heart = document.querySelector(".heart");

        if (user.liked.includes(movie.id)) {
            heart.src = "../../media/icons/filled_heart.png";
        }

        heart.addEventListener("click", async (event) => {
            event.preventDefault();

            heart.classList.toggle("filled");

            const movieId = movie.id;

            if (heart.classList.contains("filled")) {
                heart.src = "../../media/icons/filled_heart.png";

                // movieId, token, action (liked/watched)
                const request = new Request("../../api/doActivity.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        movieId: movieId,
                        token: token,
                        action: "liked"
                    })
                });

                const response = await fetch(request);
                const amountOfLikes = await response.json();

                document.getElementById("likedAmount").textContent = data.liked + 1;

            } else {
                heart.src = "../../media/icons/unfilled_heart.png";

                // movieId, token, action (liked/watched)
                const request = new Request("../../api/doActivity.php", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        movieId: movieId,
                        token: token,
                        action: "liked"
                    })
                });

                const response = await fetch(request);
                const amountOfLikes = await response.json();

                console.log(amountOfLikes);

                document.getElementById("likedAmount").textContent = data.liked;
            }
        })

        // Klick-eventet för "watched"-knappen
        const watchedButton = document.getElementById("watchedButton");

        let watched = false;

        watchedButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const movieId = movie.id;

            if (watched) {
                const request = new Request("../../api/doActivity.php", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        movieId: movieId,
                        token: token,
                        action: "watched"
                    })
                });

                const response = await fetch(request);
                const amountOfWatches = await response.json();

                document.getElementById("watchedAmount").textContent = data.watched;

                window.alert("Removed movie from your watched.");

                watched = false;

                return;
            }

            // movieId, token, action (liked/watched)
            const request = new Request("../../api/doActivity.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    movieId: movieId,
                    token: token,
                    action: "watched"
                })
            });

            const response = await fetch(request);
            // const amountOfWatches = await response.json();

            // console.log(amountOfWatches);

            document.getElementById("watchedAmount").textContent = data.watched + 1;

            // Tillfälligt för att inte kunna trycka "watched" fler gånger
            watched = true;
        });
    }
}