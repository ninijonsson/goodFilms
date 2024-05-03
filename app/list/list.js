import { PubSub } from "../../global/logic/PubSub.js"

function renderList (parentID) {
    const container = document.querySelector(parentID);

    container.innerHTML =   `<div id="headerContainer">
                                <h1>YOUR LISTS</h1>
                                <button id="addListBtn">+</button>
                            </div>
                            <div id="listsContainer">

                            </div>
    `;

    const listsContainer = document.getElementById("listsContainer");

        //Depending on database, edit what value to gather from localStorage
    let id = localStorage.getItem("id");


        //Depending on how data is stored in _state, alter keys etc.
    let user = _state.users.find(user => user.id === id);

    let userLists = user.lists;

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
            <div id="singleListContainer">
                <img src="https://image.tmdb.org/t/p/original/${list.poster_path}">
                <h2 id="listName">${list.name}</h2>
                <h3 id="username">Created by: ${list.createdBy}></h3>
                <p>DESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTION</p>
                <button id="edit">EDIT</button>
            </div>
        `;
    }
}