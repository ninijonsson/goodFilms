import { PubSub } from "../../global/logic/PubSub.js";
import { STATE } from "../../state.js";
import { options } from "../../state.js";
import { token } from "../../state.js";
import { fetcher } from '../../global/logic/fetcher.js';

PubSub.subscribe({
    event: "renderProfile",
    listener: (detail) => renderProfile(detail)
});

const mediaPrefix = "../../media/icons/";

// Gör om till Promise.all()
async function fetchMovies(type) {
    const fetchPromises = [];
    let maxMovies = 0;

    if (info[type].length < 5) {
        maxMovies = info[type].length;
    } else {
        maxMovies = 5;
    }

    for (let i = 0; i < maxMovies; i++) {
        fetchPromises.push(fetch(`https://api.themoviedb.org/3/movie/${info[type][i]}?language=en-US`, options).then(response => response.json()))
    }

    const movies = await Promise.all(fetchPromises);

    return movies;
}

const userRequest = new Request(`../../api/users.php?user=${token}`);
const user = await STATE.get("user", userRequest);

const friendRequest = new Request(`../../api/users.php?profile=${localStorage.getItem("userId")}&user=${token}`);
const friend = await STATE.get("friend", friendRequest);

let info = [];

const listsRequest = new Request(`../../api/lists.php?user=${token}`);
const lists = await STATE.get("myLists", listsRequest);

const rqst = new Request(`../../api/lists.php?user=${token}&id=226`);
const r = await fetcher(rqst);

console.log(r);

async function renderProfile(parentID) {
    const wrapper = document.getElementById(parentID);

    if (localStorage.getItem("userId")) {
        info = friend;
    } else {
        info = user;
    }

    // Få ut en lista &id=id?user=token
    const allListsRequest = new Request(`../../api/lists.php`, options);
    const allLists = await STATE.get("allLists", allListsRequest);
    const foundLists = allLists.filter(list => {
        return list.createdBy === info.id;
    });

    console.log(foundLists);

    // få ut lista -> profile=friend.id
    // ../../api/lists.php?profile=${info.id}

    wrapper.innerHTML = `
        <div id="profileDetailsContainer">
            <img id="backdropPoster" src="${info.header}">
            <div id="shadowOverlay"></div>
            <div id="profileAndEditContainer">
                <div id="profilePictureContainer">
                    <img id="profilePicture" src="${info.avatar}">
                </div>
    
                <div id="buttonContainer">
                    <button id="editButton"></button>
                </div>
            </div>
        </div>
    
            <div id="userInfo">
                <h3 id="displayName">${info.displayName}</h3>
                <p id="username">@${info.username.toLowerCase()}</p>
            </div>
    
            <div id="followContainer">
                <p id="followers">${info.followers.length} Followers</p>
                <p id="following">${info.following.length} Following</p>
            </div>
    
            <hr id="followerLine">
    
        <div id="watchedContainer">
            <div id="watchedTitleContainer">
                <h4 id="watchedTitle">WATCHED</h4>
                <h6 id="showAllWatched">SHOW ALL</h6>
            </div>
            <hr>
    
            <div id="watchedPosters">
            </div>
        </div>
    
        <div id="likedContainer">
            <div id="likedTitleContainer">
                <h4 id="likedTitle">LIKED</h4>
                <h6 id="showAllLiked">SHOW ALL</h6>
            </div>
            <hr>
    
            <div id="likedPosters">
            </div>
        </div>
    
        <div id="listsContainer">
            <div id="yourListsContainer">
                <h4 id="listsTitle">${info.displayName.toUpperCase()}'S LISTS</h4>
                <h6 id="showAllLists">SHOW ALL</h6>
            </div>
    
            <hr id="listLine">
    
            <div id="listPosters">
            </div>
        </div>
    `;

    // EDIT PROFILE
    const editButton = document.getElementById("editButton");

    if (localStorage.getItem("userId")) {

        editButton.textContent = "FOLLOW";
        editButton.classList.add("save");

        for (let i = 0; i < info.followers.length; i++) {
            if (info.followers[i] === user.id) {
                editButton.textContent = "FOLLOWING";
                editButton.classList.remove("save");
                break;
            }
        }

    } else {
        editButton.textContent = "EDIT";
    }

    editButton.addEventListener("click", async (event) => {
        event.preventDefault();

        // Selektera profilbilden och backdrop
        const profilePicture = document.getElementById("profilePicture");
        const backdropPoster = document.getElementById("backdropPoster");
        const displayName = document.getElementById("displayName");

        if (editButton.textContent === "SAVE") {
            profilePicture.src = `${mediaPrefix}profile_picture.png`;
            backdropPoster.src = `${mediaPrefix}test_backdrop_profile.jpeg`;

            const input = document.querySelector("input");

            const inputValue = input.value;

            if (inputValue !== "") {
                const request = new Request("../../api/users.php", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        displayName: inputValue,
                        token: token // Fixa token
                    })
                });

                const response = await fetch(request);
                const resource = await response.json();

                displayName.textContent = resource.displayName;
            }

            input.remove();

            displayName.style.display = "block";

            editButton.classList.remove("save");
            editButton.textContent = "EDIT";

        } else if (editButton.textContent === "EDIT") {

            displayName.style.display = "none";

            const inputDisplayName = document.createElement("input");
            document.getElementById("userInfo").prepend(inputDisplayName);

            profilePicture.src = `${mediaPrefix}add_profile_picture.png`;
            backdropPoster.src = `${mediaPrefix}add_backdrop_profile.png`;

            editButton.classList.add("save");
            editButton.textContent = "SAVE";

            const deleteBttn = document.createElement("button");
            document.getElementById("buttonContainer").append(deleteBttn);
            deleteBttn.textContent = "DELETE :(";
            deleteBttn.id = "deleteBttn";

            deleteBttn.addEventListener("click", async () => {
                window.alert("Are you sure you want to proceed? A kitten dies every time a user is deleted... :(");

                let deleteRqst = new Request("../../api/users.php", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "token": token })
                });

                let deleteFetch = await fetcher(deleteRqst);
                localStorage.removeItem("token");
                window.location = "../../start/";

            });

        } else if (editButton.textContent === "FOLLOW") {

            editButton.textContent = "FOLLOWING";
            editButton.classList.remove("save");

            const request = new Request("../../api/followActivity.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: friend.id,
                    token: token,
                })
            })
            const response = await fetcher(request);

            document.getElementById("followers").textContent = `${(info.followers.length + 1)} Followers`;

        } else if (editButton.textContent === "FOLLOWING") {
            editButton.textContent = "FOLLOW";
            editButton.classList.add("save");

            const request = new Request("../../api/followActivity.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: friend.id,
                    token: token,
                })
            })
            const response = await fetcher(request);
            console.log(response);

            document.getElementById("followers").textContent = `${info.followers.length} Followers`;
        }
    })

    // "WATCHED" POSTERS
    const watchedPosters = document.getElementById("watchedPosters");

    const watchedMovies = await fetchMovies("watched");

    for (let i = 0; i < watchedMovies.length; i++) {
        if (watchedMovies[i].poster_path === undefined) {
            continue;
        }

        watchedPosters.innerHTML += `
            <img class="movie" id="watched_${i}" src="https://image.tmdb.org/t/p/original/${watchedMovies[i].poster_path}">
        `;
    }

    // "LIKED" POSTERS
    const likedPosters = document.getElementById("likedPosters");

    const likedMovies = await fetchMovies("liked");

    for (let i = 0; i < likedMovies.length; i++) {
        if (likedMovies[i].poster_path === undefined) {
            continue;
        }

        likedPosters.innerHTML += `
            <img class="movie" id="liked_${i}" src="https://image.tmdb.org/t/p/original/${likedMovies[i].poster_path}">
        `;
    }

    // SHOW ALL WATCHED
    const showAllWatched = document.getElementById("showAllWatched");

    showAllWatched.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.setItem("usersId", info.id);

        window.location = "../watchedList/index.html";
    });

    // SHOW ALL LIKED
    const showAllLiked = document.getElementById("showAllLiked");

    showAllLiked.addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.setItem("usersId", info.id);

        window.location = "../likedList/index.html";
    });

    // SHOW LISTS
    const listPosters = document.getElementById("listPosters");

    for (let i = 0; i < foundLists.length; i++) {
        listPosters.innerHTML += `
            <img class="listPoster" id="${foundLists[i].id}" src="${foundLists[i].backdropPath}">
            <h5 id="listTitle">${foundLists[i].name}</h5>
            <p id="listDescription">${foundLists[i].description}</p>
        `;
    }

    document.querySelectorAll("#listPosters img").forEach(list => {
        list.addEventListener("click", (event) => {
            event.preventDefault();

            localStorage.setItem("list", `../../api/lists.php?id=${event.target.id}&user=${token}`);

            window.location = "../clickedList/";
        })
    });
}

