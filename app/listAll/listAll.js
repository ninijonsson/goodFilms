import { options } from "../../state.js";
import { token } from "../../state.js";
import { PubSub } from "../../../global/logic/PubSub.js";
import { STATE } from "../../state.js";


// Om tid finns, gör search, annars ta bort

PubSub.subscribe({
    event: "renderListAll",
    listener: (detail) => renderListAll(detail)
});

async function renderListAll(parentID) {
    const usersRequest = new Request(`../../api/lists.php`, options);
    const usersLists = await STATE.get("allLists", usersRequest);

    console.log(usersLists);
    // const usersLists = await fetcher(usersRequest);

    const myRequest = new Request(`../../api/lists.php?user=${token}`, options);
    const myLists = await STATE.get("myLists", myRequest);

    // renderHeader();

    const wrapper = document.getElementById(parentID);

    wrapper.innerHTML = `
    <div id="upperContainer">      
        <div id="createNewListContainer">
            <h2 id="createNewList">CREATE NEW LIST</h2>
            <p id="addNewList">+</p>
        </div>

        <hr id="createLine">
    </div>

    <div id="whatsNewContainer">
        <div id="newTextContainer">
            <h3 id="whatsNew">WHAT'S NEW?</h3>
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

    const listPosters = document.querySelectorAll(".listPoster");

    listPosters.forEach(list => {
        list.addEventListener("click", (event) => {
            event.preventDefault();

            window.location = "../clickedList/";
        })
    })
    let createNewListContainer = document.getElementById("createNewListContainer");
    createNewListContainer.addEventListener("click", () => {
        
        if (localStorage.getItem("listID")) {
            localStorage.removeItem("listID")
        }

        window.location = '../editList/index.html';
    })

    let showAllMy = document.getElementById("showAllMy");

    showAllMy.addEventListener("click", (event) => {
        event.preventDefault();
        let userId;

        if (myLists.length > 0) {
            userId = myLists[0].createdBy;
        } else {
            return;
        }

        localStorage.setItem("infoId", userId);
        
        window.location = "../list/";
    });
}