import { fetcher } from '../../global/logic/fetcher.js';
import { PubSub } from "../../global/logic/PubSub.js";
import { STATE } from "../../state.js";
import { options } from "../../state.js";
import { token } from "../../state.js";

PubSub.subscribe({
    event: "renderMemberList",
    listener: (detail) => renderMemberList(detail)
})

async function renderMemberList(parentID = "wrapper") {
    const container = document.getElementById(parentID);

    let users = await STATE.get("allUsers", "../../api/users.php");
    console.log(users);
    container.innerHTML = `
                            <div id="topContainer">
                                <input id="searchMember" placeholder="Search for members"></input>
                                <h1>SHOWING RESULTS FOR:</h1>
                                <h2></h2>
                                <p id="results">X results</p>
                            </div>
                            <div id="userContainer"></div>
    `;

    const usersContainer = document.getElementById("userContainer");

    for (let user of users) {
        let userContainer = document.createElement("div");
        userContainer.id = `user${user.id}`;

        userContainer.innerHTML = `
                                    <img class="profilePicture" src="${user.avatar}">
                                    <p class="displayName">${user.displayName}</p>
                                    <p class="username">@${user.username}</p>
        `;

        usersContainer.appendChild(userContainer);
    }

    const usersFound = document.querySelectorAll("#userContainer div");

    usersFound.forEach(user => {
        user.addEventListener("click", (event) => {
            event.preventDefault();

            const userId = user.id.slice(4);

            localStorage.setItem("userId", userId);

            window.location = "../profile/";
        })
    });

    document.getElementById("results").textContent = `${users.length} results`;
    const input = document.querySelector("input");

    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter" && input.value !== "") {

            let resultsCounter = 0;
            const usersContainer = document.getElementById("userContainer");
            usersContainer.innerHTML = ``;

            for (let user of users) {

                if (user.displayName.includes(input.value)) {

                    let foundUserContainer = document.createElement("div");
                    foundUserContainer.id = `user${user.id}`;
                    resultsCounter++;

                    foundUserContainer.innerHTML = `
                                                <img src="${user.avatar}">
                                                <p class="displayName">${user.displayName}</p>
                                                <p class="username">@${user.username}</p>
                    `;

                    usersContainer.append(foundUserContainer);
                }

            }

            document.getElementById("results").textContent = `${resultsCounter} results`;

            if (usersContainer.innerHTML === ``) {
                usersContainer.innerHTML = `<h2>No users matched the search criteria</h2>`;
            }
        }
    });
}