import { PubSub } from "../../logic/PubSub.js"

// // Rendera hamburgarmenyn i headern
// PubSub.subscribe({
//     event: "hamburgerMenu",
//     listener: (detail) => {
//         renderHamburgerMenu(detail);
//     }
// });

function renderHamburgerMenu(parentID) {
    const parent = document.getElementById(parentID);

    parent.innerHTML = `
        <div id="hamburgerContainer">
            <img id="hamburgerMenu" src=""> // Hamburger menu as img?
        </div>
    `;

    const hamburgerMenu = document.getElementById("hamburgerMenu");

    hamburgerMenu.addEventListener("click", (event) => {
        // Gör så att hamburgarmenyn öppnas och kunna klicka till alla de olika sidorna

        const parent = event.parentNode.parentNode;

        parent.innerHTML = `
            <div id="hamburgerMenuContainer">
                <div id="closeButton">X</div>
                <div id="homeButton">HOME</div>
                <div id="profileButton">PROFILE</div>
                <div id="searchMoviesButton">SEARCH MOVIES</div>
                <div id="listsButton">LISTS</div>
                <div id="membersButton">MEMBERES</div>
            </div>
        `;

        // Stänga hamburgarmenyn
        const closeButton = hamburgerMenu.getElementById("closeButton");
        closeButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);
        })

        // Gå till feed
        const homeButton = hamburgerMenu.getElementById("homeButton");
        homeButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "home"; // Hänvisa till rätt sökväg
        })

        // Gå till profilsidan
        const profileButton = hamburgerMenu.getElementById("profileButton");
        profileButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "profile"; // Hänvisa till rätt sökväg
        })

        // Gå till "Search Movies"
        const searchMoviesButton = hamburgerMenu.getElementById("searchMoviesButton");
        searchMoviesButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "profile"; // Hänvisa till rätt sökväg
        })

        // Gå till listorna
        const listsButton = hamburgerMenu.getElementById("listsButton");
        listsButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "lists"; // Hänvisa till rätt sökväg
        })

        // Gå till medlemmarna
        const membersButton = hamburgerMenu.getElementById("membersButton");
        membersButton.addEventListener("click", (event) => {
            removeHamburgerContainer(event);

            window.location = "members"; // Hänvisa till rätt sökväg
        })
    });
}

function removeHamburgerContainer(event) {
    const container = event.parentNode; // Target vår hamburgarmenys container
    container.remove();
}