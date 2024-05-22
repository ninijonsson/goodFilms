import { renderHeader } from "../../global/components/header/header.js"

// Gör om till global variabel
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

// DELETE USER!

// Test token
const token = "c62f39ace22172680875af13e02f6a6313ea1125";

const mediaPrefix = "../../media/icons/";

renderHeader();

// Gör om till Promise.all()
async function fetchMovies(type) {
    const fetchPromises = [];
    let maxMovies = 0;

    if (user[type].length < 5) {
        maxMovies = user[type].length;
    } else {
        maxMovies = 5;
    }

    for (let i = 0; i < maxMovies; i++) {
        fetchPromises.push(fetch(`https://api.themoviedb.org/3/movie/${user[type][i]}?language=en-US`, options).then(response => response.json()))
    }

    const movies = await Promise.all(fetchPromises);

    return movies;
}

async function getUser() {
    const response = await fetch(`../../api/users.php?user=${token}`);
    const resource = await response.json();

    return resource;
}

const user = await getUser();
const lists = await getUsersLists();

const wrapper = document.getElementById("wrapper");

wrapper.innerHTML = `
    <div id="profileDetailsContainer">
        <img id="backdropPoster" src="${user.header}">
        <div id="shadowOverlay"></div>
        <div id="profileAndEditContainer">
            <img id="profilePicture" src="${user.avatar}">

            <div id="buttonContainer">
                <button id="editButton">EDIT</button>
            </div>
        </div>
    </div>

        <div id="userInfo">
            <h3 id="displayName">${user.displayName}</h3>
            <p id="username">@${user.username.toLowerCase()}</p>
        </div>

        <div id="followContainer">
            <p id="followers"></p>
            <p id="following"></p>
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
            <h4 id="listsTitle">YOUR LISTS</h4>
            <h6 id="showAllLists">SHOW ALL</h6>
        </div>
        
        <hr id="listLine">

        <div id="listPosters">
        </div>
    </div>
`;

async function getUsersLists() {
    const response = await fetch(`../../api/lists.php?user=${token}`);
    const lists = await response.json();

    return lists;
}

// EDIT PROFILE
const editButton = document.getElementById("editButton");

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
        document.getElementById("userInfo").append(inputDisplayName);

        profilePicture.src = `${mediaPrefix}add_profile_picture.png`;
        backdropPoster.src = `${mediaPrefix}add_backdrop_profile.png`;

        editButton.classList.add("save");
        editButton.textContent = "SAVE";
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

console.log(likedMovies);

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

    window.location = "../watchedList/index.html";
});

// SHOW ALL LIKED
const showAllLiked = document.getElementById("showAllLiked");

showAllLiked.addEventListener("click", (event) => {
    event.preventDefault();

    window.location = "../likedList/index.html";
});

// SHOW LISTS
const listPosters = document.getElementById("listPosters");

for (let i = 0; i < lists.length; i++) {
    listPosters.innerHTML += `
        <img class="listPoster" id="${lists[i].id}" src="${lists[i].backdropPath}">
        <h5 id="listTitle">${lists[i].name}</h5>
        <p id="listDescription">${lists[i].description}</p>
    `;
}
