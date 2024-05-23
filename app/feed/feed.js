import { PubSub } from "../../global/logic/PubSub.js";
import { STATE } from "../../state.js";
import { fetcher } from "../../global/logic/fetcher.js";
import { options } from "../../state.js";
import { token } from "../../state.js";

PubSub.subscribe({
    event: "renderFeed",
    listener: (detail) => renderFeed(detail)
});

async function renderFeed(parentID) {
    const parent = document.getElementById(parentID);

    const userRequest = new Request(`../../api/users.php?user=${token}`);
    const user = await STATE.get("user", userRequest);

    const allUsersRequest = new Request(`../../api/users.php`);
    const allUsers = await STATE.get("allUsers", allUsersRequest);

    const activitesRequest = new Request(`../../api/getActivity.php?user=${token}`);
    const activities = await STATE.get("allActivity", activitesRequest);

    console.log(activities);

    const listRequest = new Request(`../../api/lists.php`);
    const allLists = await STATE.get("allLists", listRequest);

    parent.innerHTML = `
        <h1 id="welcomeText">WELCOME, <span>${user.displayName.toUpperCase()}</span> !</h1>

        <div id="activityFeed">
            <h2 id="activityTitle">ACTIVITY FROM FRIENDS</h2>
            <hr id="activityLine">

            <div id="activityContainer">
                <div id="movieContainer">
                </div>
            </div>
        </div>

        <div id="whatsNewContainer">
            <h2 id="newLists">NEW LISTS</h2>

            <hr id="newLine">

            <div id="newListPosters"></div>

    </div>

    <hr id="shortLine">
    `;

    const movieContainer = document.getElementById("movieContainer");

    if (!activities) {
        movieContainer.innerHTML = "<p id='loner'>No friends! :(</p>"
    } else {
        let fetchPromises = [];
        activities.reverse();

        let maxNum = 0;
        if (activities.length < 6) {
            maxNum = activities.length;
        } else {
            maxNum = 6;
        }

        for (let i = 0; i < maxNum; i++) {
            const request = new Request(`https://api.themoviedb.org/3/movie/${activities[i].movieId}?language=en-US`, options);

            fetchPromises.push(
                fetcher(request)
            )
        }

        const results = await Promise.all(fetchPromises);

        for (let i = 0; i < results.length; i++) {
            const movie = await results[i];

            const friend = allUsers.find((friend) => friend.id === activities[i].userId);

            movieContainer.innerHTML += `
            <div class="activityInfo">
                <img class="movie" id="${movie.id}" src="https://image.tmdb.org/t/p/original/${movie.poster_path}"></img>
                <img class="profilePicture" src=""></img>
                <p class="username">@${friend.username}</p>
                <p class="statusText">${activities[i].action} <span>${movie.title}</span></p>
            </div>     
        `;
        }
    }

    // Klicka sig till filmernas movie page
    movieContainer.addEventListener("click", async (event) => {
        console.log(event);
        if (event.target.classList.contains("movie")) {
            const movieId = event.target.id;

            window.localStorage.setItem("movieInfo", `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`);

            window.location = "../moviePage/index.html";
        }
    });

    // Rendera listorna
    const newListPosters = document.getElementById("newListPosters");

    let maxNew = 0;

    if (allLists.length < 3) {
        maxNew = allLists.length;
    } else {
        maxNew = 3;
    }

    for (let i = 0; i < maxNew; i++) {
        newListPosters.innerHTML += `
        <img class="listPoster" id="${allLists[i].id}" src="${allLists[i].backdropPath}">
        <h5 id="listTitle">${allLists[i].name}</h5>
        <p id="listDescription">${allLists[i].description}</p>
    `;
    }

    document.querySelectorAll("#newListPosters img").forEach(list => {
        list.addEventListener("click", (event) => {
            event.preventDefault();

            localStorage.setItem("list", `../../api/lists.php?id=${event.target.id}&user=${token}`);

            window.location = "../clickedList/";
        })
    });
}