import { PubSub } from "../../logic/PubSub.js"

export function renderHamburgerMenu() {
    const header = document.querySelector("header");

    header.innerHTML += `
        <div id="hamburgerContainer">
            <img id="hamburgerMenu" src="../../media/icons/hamburger_icon.svg">
        </div>
    `;
}