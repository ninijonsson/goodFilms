import { PubSub } from "../../global/logic/PubSub.js";
import {fetcher} from '../../global/logic/fetcher.js';

async function renderList (parentID) {
    const container = document.getElementById(parentID);

    container.innerHTML =   `<div id="headerContainer">
                                <h1>YOUR LISTS</h1>
                                <button id="addListBtn">+</button>
                            </div>
                            <div id="listsContainer">

                            </div>
    `;

    const listsContainer = document.getElementById("listsContainer");

    const token = "c62f39ace22172680875af13e02f6a6313ea1125";

    let options = {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"token": token})
    }

    let user = await fetcher("../../api/lists.php", options);

    console.log(user);
    

    if (userLists === []) {
        listsContainer.innerHTML = `<p>You have not created any lists yet. Get started now!</p>`;
        return;
    }

    let lists = [];

        //Same as previous comment
    _state.lists.forEach( list => {
        if (userLists.includes(list.id)) {
            lists.push(list);
        }
    });

        //Same, alter keys depending on DB
    for (let list of lists) {
        listsContainer.innerHTML = `
            <div id="singleListContainer${list.id}">
                <img src="https://image.tmdb.org/t/p/original/${list.poster_path}">
                <h2 id="listName">${list.name}</h2>
                <h3 id="username">Created by: ${list.createdBy}></h3>
                <p>DESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTION</p>
                <button id="edit">EDIT</button>
            </div>
        `;

        const listContainer = document.querySelector(`#singleListContainer${list.id}`);

        listContainer.addEventListener("click", renderSingleList);
    }
}

renderList("wrapper");