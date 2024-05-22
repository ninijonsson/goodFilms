import { renderHeader } from "../../global/components/header/header.js"
import { fetcher } from "../../global/logic/fetcher.js"

// Gör om till global variabel
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

const token = "c62f39ace22172680875af13e02f6a6313ea1125";

// Om tid finns, gör search, annars ta bort

const usersRequest = new Request(`../../api/lists.php`, options);
const usersLists = await fetcher(usersRequest);

const myRequest = new Request(`../../api/lists.php?user=${token}`, options);
const myLists = await fetcher(myRequest);

renderHeader();

const wrapper = document.getElementById("wrapper");

wrapper.innerHTML = `
    <div id="upperContainer">
        <input id="searchList" placeholder="SEARCH FOR LISTS">
        <hr>
        
        <div id="createNewListContainer">
            <h2 id="createNewList">CREATE NEW LIST</h2>
            <p id="addNewList">+</p>
        </div>

        <hr id="createLine">
    </div>

    <div id="whatsNewContainer">
        <div id="newTextContainer">
            <h3 id="whatsNew">WHAT'S NEW?</h3>
            <h4 id="showAllNewLists">SHOW ALL</h4>
        </div>

        <hr id="newLine">

        <div id="newListPosters"></div>

    </div>

    <hr id="shortLine">

    <div id="myListsContainer">
        <div id="myTextContainer">
            <h2 id="myLists">MY LISTS</h2>
            <p id="showAllMy">SHOW ALL</p>
        </div>

        <hr id="newLine">

        <div id="myListPosters"></div>

    </div>
`;

// SHOW "WHAT'S NEW?" LISTS
const newListPosters = document.getElementById("newListPosters");

let maxNew = 0;

if (usersLists.length < 3) {
    maxNew = usersLists.length;
} else {
    maxNew = 3;
}

for (let i = 0; i < maxNew; i++) {
    newListPosters.innerHTML += `
        <img class="listPoster" id="${usersLists[i].id}" src="${usersLists[i].backdropPath}">
        <h5 id="listTitle">${usersLists[i].name}</h5>
        <p id="listDescription">${usersLists[i].description}</p>
    `;
}

// SHOW MY LISTS
const myListPosters = document.getElementById("myListPosters");

let maxMy = 0;

if (myLists.length < 3) {
    maxMy = myLists.length;
} else {
    maxMy = 3;
}

for (let i = 0; i < maxMy; i++) {
    myListPosters.innerHTML += `
        <img class="listPoster" id="${myLists[i].id}" src="${myLists[i].backdropPath}">
        <h5 id="listTitle">${myLists[i].name}</h5>
        <p id="listDescription">${myLists[i].description}</p>
    `;
}