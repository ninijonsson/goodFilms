import { PubSub } from "../../logic/PubSub.js"

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

    header.innerHTML += `
        <p>goodFilms</p>
    `;
}