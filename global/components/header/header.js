import { PubSub } from "../../logic/PubSub.js"
import { renderHamburgerMenu } from "../hamburgerMenu/hamburgerMenu.js"

// // Skapa hamburgarmenyn
// PubSub.publish({
//     event: "hamburgerMenu",
//     detail: "header"
// });

// Rendera headern
// PubSub.publish({
//     event: "header",
//     detail: "wrapper"
// });

export function renderHeader() {
    const header = document.querySelector("header");

    renderHamburgerMenu();

    header.innerHTML += `
        <p>goodFilms</p>
    `;

    const hamburgerMenu = document.getElementById("hamburgerContainer");

    hamburgerMenu.addEventListener("click", (event) => {
        // Gör så att hamburgarmenyn öppnas och kunna klicka till alla de olika sidorna

        const parent = event.target.parentNode.parentNode.parentNode;

        const hamburgerOverlay = document.createElement("div");
        hamburgerOverlay.id = "hamburgerOverlay";

        console.log(parent);

        hamburgerOverlay.innerHTML = `
            <div id="hamburgerMenuContainer">
                <div id="closeButton">X</div>
                <div id="homeButton">
                    <img src="../../../media/icons/home_icon.svg" alt="Home icon">
                    HOME
                </div>
                <div id="profileButton">
                    <img src="../../../media/icons/profile_icon.svg" alt="Profile icon">
                    PROFILE
                </div>
                <div id="searchMoviesButton">
                    <img src="../../../media/icons/search_icon.svg" alt="Search icon">
                    SEARCH MOVIES
                </div>
                <div id="listsButton">
                    <img src="../../../media/icons/lists_icon.svg" alt="Lists icon">
                    LISTS
                </div>
                <div id="membersButton">
                    <img src="../../../media/icons/members_icon.svg" alt="Members icon">
                    MEMBERES
                </div>
            </div>
        `;

        parent.append(hamburgerOverlay);

        // Stänga hamburgarmenyn
        const closeButton = document.getElementById("closeButton");
        closeButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);
        })

        // Gå till feed
        const homeButton = document.getElementById("homeButton");
        homeButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "home"; // Hänvisa till rätt sökväg
        })

        // Gå till profilsidan
        const profileButton = document.getElementById("profileButton");
        profileButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "../profile/index.html"; // Hänvisa till rätt sökväg
        })

        // Gå till "Search Movies"
        const searchMoviesButton = document.getElementById("searchMoviesButton");
        searchMoviesButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "../searchMovies/index.html"; // Hänvisa till rätt sökväg
        })

        // Gå till listorna
        const listsButton = document.getElementById("listsButton");
        listsButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "lists"; // Hänvisa till rätt sökväg
        })

        // Gå till medlemmarna
        const membersButton = document.getElementById("membersButton");
        membersButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "members"; // Hänvisa till rätt sökväg
        })
    });
}

function removeHamburgerContainer(event) {
    const container = document.getElementById("hamburgerOverlay");

    container.remove();
}