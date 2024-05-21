import { renderHeader } from "../../global/components/header/header.js"

// Gör om till global variabel
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

const mediaPrefix = "../../media/icons/";

renderHeader();

// Gör om denna till global funktion? I state.js?
async function getMovies() {
    const response = await fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options);
    const resource = await response.json();

    return resource;
}

const movies = await getMovies();

console.log(movies);

const wrapper = document.getElementById("wrapper");

wrapper.innerHTML = `
    <div id="profileDetailsContainer">
        <img id="backdropPoster" src="../../media/icons/test_backdrop_profile.jpeg">
        <div id="shadowOverlay"></div>
        <div id="profileAndEditContainer">
            <img id="profilePicture" src="../../media/icons/profile_picture.png">

            <div id="buttonContainer">
                <button id="editButton">EDIT</button>
            </div>
        </div>
    </div>

        <div id="userInfo">
            <h3 id="displayName">Nicole</h3>
            <p id="username">@nicoleJ</p>
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
        <h4 id="listsTitle">YOUR LISTS</h4>
        <h6 id="showAllLists">SHOW ALL</h6>
        <hr>

        <div id="listsPosters">
            <img id="" src="">
            <h5 id="listTitle">My top 10 romance movies</h5>
            <p id="listDescription">They are so romantic!</p>
        </div>
    </div>
`;

// EDIT PROFILE
const editButton = document.getElementById("editButton");

editButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (editButton.textContent === "SAVE") {
        profilePicture.src = `${mediaPrefix}profile_picture.png`;
        backdropPoster.src = `${mediaPrefix}test_backdrop_profile.jpeg`;

        editButton.classList.remove("save");
        editButton.textContent = "EDIT";
    } else if (editButton.textContent === "EDIT") {
        // Selektera profilbilden, backdrop och knappen
        const profilePicture = document.getElementById("profilePicture");
        const backdropPoster = document.getElementById("backdropPoster");

        profilePicture.src = `${mediaPrefix}add_profile_picture.png`;
        backdropPoster.src = `${mediaPrefix}add_backdrop_profile.png`;

        console.log(profilePicture.src);

        editButton.classList.add("save");
        editButton.textContent = "SAVE";
    }
})

// "WATCHED" POSTERS
const watchedPosters = document.getElementById("watchedPosters");

for (let i = 0; i < 5; i++) {
    watchedPosters.innerHTML += `
        <img class="movie" id="watched_${i}" src="https://image.tmdb.org/t/p/original/${movies.results[i].poster_path}">
    `;
}

// "LIKED" POSTERS
const likedPosters = document.getElementById("likedPosters");

for (let i = 0; i < 5; i++) {
    likedPosters.innerHTML += `
        <img class="movie" id="liked_${i}" src="https://image.tmdb.org/t/p/original/${movies.results[i].poster_path}">
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

