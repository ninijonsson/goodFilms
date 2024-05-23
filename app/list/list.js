import { PubSub } from "../../global/logic/PubSub.js";
import { fetcher } from '../../global/logic/fetcher.js';
import { token } from '../../state.js';


async function renderList (parentID) {
    const container = document.getElementById(parentID);

    container.innerHTML =   `<div id="headerContainer">
                                <h1>YOUR LISTS</h1>
                                <img id="addListBtn" src="../../media/icons/plus_btn.svg"></button>
                            </div>
                            <div id="listsContainer">

                            </div>
    `;

    const createListRedirect = document.querySelector("#addListBtn");

    createListRedirect.addEventListener("click", () => {
        
        if (localStorage.getItem("listID")) {
            localStorage.removeItem("listID");
        }

        window.location = '../editList/index.html';
    });

    const listsContainer = document.getElementById("listsContainer");

    let userLists = await fetcher(`../../api/lists.php?user=${token}`);

    console.log(userLists);

    if (userLists.length === 0 || !userLists) {
        listsContainer.innerHTML = `<p>You have not created any lists yet. Get started now!</p>`;
        return;
    }

    for (let list of userLists) {
        let singleList = await fetcher(`../../api/lists.php?user=${token}&id=${list.id}`);
        console.log(singleList);
        let path;
        console.log(singleList.backdropPath);
        if (singleList.backdropPath === "../../media/icons/hello_kitty.png") {
            path = "../../media/icons/hello_kitty.png";
        } else {
            path = `https://image.tmdb.org/t/p/original${singleList.backdropPath}`;
        }

        listsContainer.innerHTML += `
            <div id="${singleList.id}" class="singleListContainer">
                <div class="imgContainer">
                    <img src=${path}>
                    <button class="edit">EDIT</button>
                </div>
                <div class="listInfo">
                    <h2 id="listName">${singleList.name}</h2>
                    <h3 id="username">Created by: ${singleList.createdBy}</h3>
                    <p>${singleList.description}</p>
                </div>
                
            </div>
        `;
    }
}

renderList("wrapper");