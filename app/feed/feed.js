import { renderHeader } from "../../global/components/header/header.js"
import { fetcher } from "../../global/logic/fetcher.js"
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

        <div id="newLists">
            <div class="list">
                <img id="listPoster_1" src=""></img>
                <h3 id="listName_1">List name</h3>
                <p id="listDescription"></p>
                <img id="profilePicture_1></img>
                <p id="username_1></p>
            </div>
        </div>
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
}

renderFeed("wrapper");

function getActivityFromFriends(parentID) {

}

function getNewLists(parentID) {

}