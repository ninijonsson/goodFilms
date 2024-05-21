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

const wrapper = document.getElementById("wrapper");

wrapper.innerHTML = `
    <div id="profileDetailsContainer">
        <img id="backdropPoster" src="../../media/icons/test.png">
        <div id="shadowOverlay"></div>
        <img id="profilePicture" src="../../media/icons/profile_picture.png">

        <button id="editButton">EDIT</button>

        <h3 id="displayName">Nicole</h3>
        <p id="username">@nicoleJ</p>

        <div id="followContainer">
            <p id="followers"></p>
            <p id="following"></p>
        </div>

        <hr>
    </div>

    <div id="watchedContainer">
        <h4 id="watchedTitle">WATCHED</h4>
        <h6 id="showAllWatched">SHOW ALL</h6>
        <hr>

        <div id="watchedPosters">
            <img id="" src="">
            <img id="" src="">
            <img id="" src="">
            <img id="" src="">
            <img id="" src="">
        </div>
    </div>

    <div id="likedContainer">
        <h4 id="likedTitle">LIKED</h4>
        <h6 id="showAllLiked">SHOW ALL</h6>
        <hr>

        <div id="likedPosters">
            <img id="" src="">
            <img id="" src="">
            <img id="" src="">
            <img id="" src="">
            <img id="" src="">
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

// SHOW ALL WATCHED
const showAllWatched = document.getElementById("showAllWatched");

showAllWatched.addEventListener("click", (event) => {

});

// SHOW ALL LIKED
const showAllLiked = document.getElementById("showAllLiked");

showAllLiked.addEventListener("click", (event) => {

});

