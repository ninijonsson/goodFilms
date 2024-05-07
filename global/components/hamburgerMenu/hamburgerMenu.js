import { PubSub } from "../../logic/PubSub.js"

// // Rendera hamburgarmenyn i headern
// PubSub.subscribe({
//     event: "hamburgerMenu",
//     listener: (detail) => {
//         renderHamburgerMenu(detail);
//     }
// });

export function renderHamburgerMenu() {
    const header = document.querySelector("header");

    header.innerHTML += `
        <div id="hamburgerContainer">
            <img id="hamburgerMenu" src="../../../media/icons/hamburger_icon.svg">
        </div>
    `;
}

function removeHamburgerContainer(event) {
    const container = event.parentNode; // Target vår hamburgarmenys container
    container.remove();
}