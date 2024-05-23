import { renderHeader } from "../../global/components/header/header.js";
import { fetcher } from "../../global/logic/fetcher.js";
import { options } from "../../state.js";
import { token } from "../../state.js";

renderHeader();

async function renderFeed(parentID) {
    const parent = document.getElementById(parentID);

    const userRequest = new Request(`../../api/users.php?user=${token}`, options);
    const user = await fetcher(userRequest);

    const allUsersRequest = new Request(`../../api/users.php`, options);
    const allUsers = await fetcher(allUsersRequest);

    const activitesRequest = new Request(`../../api/getActivity.php`, options);
    const activities = await fetcher(activitesRequest);

    const listRequest = new Request(`../../api/lists.php`, options);
    const allLists = await fetcher(listRequest);

    console.log(allLists);

    parent.innerHTML = `
        <h1 id="welcomeText">WELCOME, <span>${user.displayName.toUpperCase()}!</span></h1>

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

    let fetchPromises = [];

    for (let i = 0; i < 6; i++) {
        const request = new Request(`https://api.themoviedb.org/3/movie/${activities[i].movieId}?language=en-US`, options);

        fetchPromises.push(
            fetcher(request)
        )
    }

    const results = await Promise.all(fetchPromises);

    console.log(user);

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
}

renderFeed("wrapper");

function getActivityFromFriends(parentID) {

}

function getNewLists(parentID) {

}