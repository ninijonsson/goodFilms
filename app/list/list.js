import { PubSub } from "../../global/logic/PubSub.js";
import { fetcher } from '../../global/logic/fetcher.js';



async function renderList (parentID) {
    const container = document.getElementById(parentID);

    container.innerHTML =   `<div id="headerContainer">
                                <h1>YOUR LISTS</h1>
                                <img id="addListBtn" src="../../media/icons/plus_btn.svg"></button>
                            </div>
                            <div id="listsContainer">

                            </div>
    `;

    const listsContainer = document.getElementById("listsContainer");

    const token = "c62f39ace22172680875af13e02f6a6313ea1125";

    let userLists = await fetcher(`../../api/lists.php?user=${token}`);

    console.log(userLists);

    if (userLists === [] || !userLists) {
        listsContainer.innerHTML = `<p>You have not created any lists yet. Get started now!</p>`;
        return;
    }

    for (let list of userLists) {
        let singleList = await fetcher(`../../api/lists.php?user=${token}&id=${list.id}`);
        console.log(singleList);

        listsContainer.innerHTML += `
            <div id="${singleList.id}" class="singleListContainer">
                <div class="imgContainer">
                    <img src="https://image.tmdb.org/t/p/original${singleList.posterPath}">
                    <button class="edit">EDIT</button>
                </div>
                <div class="listInfo">
                    <h2 id="listName">${singleList.name}</h2>
                    <h3 id="username">Created by: ${singleList.createdBy}</h3>
                    <p>${singleList.description}</p>
                </div>
                
            </div>
        `;

        const popupBtn = document.querySelector("#addListBtn");

        popupBtn.addEventListener("click", addListPopup);
    }
}

renderList("wrapper");