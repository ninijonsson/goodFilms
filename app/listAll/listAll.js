import { renderHeader } from "../../global/components/header/header.js"

// Gör om till global variabel
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

const token = "c62f39ace22172680875af13e02f6a6313ea1125";

async function getUsersLists() {
    const response = await fetch(`../../api/lists.php?user=${token}`);
    const lists = await response.json();

    return lists;
}

const lists = await getUsersLists();

console.log(lists);

renderHeader();

const wrapper = document.getElementById("wrapper");

wrapper.innerHTML = `
    <div id="upperContainer">
        <input id="searchList" placeholder="SEARCH FOR LISTS">
        <hr>
        
        <div id="createNewListContainer">
            <h2 id="createNewList">CREATE NEW LIST</h2>
            <p id="addNewList">X</p>
        </div>

        <hr>
    </div>

    <div id="whatsNewContainer">
        <div id="newTextContainer">
            <h3 id="whatsNew">WHAT'S NEW?</h3>
            <h4 id="showAllNewLists">SHOW ALL</h4>
        </div>

        <hr>

        <div id="newListPosters"></div>

    </div>

    <hr id="shortLine">

    <div id="myListsContainer">
        <div id="myTextContainer">
            <h2 id="createNewList">MY LISTS</h2>
            <p id="addNewList">SHOW ALL</p>
        </div>

        <hr>

        <div id="myListPosters"></div>

    </div>
`;

// SHOW "WHAT'S NEW?" LISTS
const newListPosters = document.getElementById("newListPosters");

for (let i = 0; i < lists.length; i++) {
    newListPosters.innerHTML += `
        <img class="listPoster" id="${lists[i].id}" src="${lists[i].backdropPath}">
        <h5 id="listTitle">${lists[i].name}</h5>
        <p id="listDescription">${lists[i].description}</p>
    `;
}