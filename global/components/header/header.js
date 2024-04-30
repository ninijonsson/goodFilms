import { PubSub } from "../../logic/PubSub.js"

// // Skapa hamburgarmenyn
// PubSub.publish({
//     event: "hamburgerMenu",
//     detail: "header"
// });

// // Rendera headern
// PubSub.publish({
//     event: "header",
//     detail: "wrapper"
// });

export function renderHeader(parentID) {
    const parent = document.getElementById(parentID);

    const header = document.createElement("div");
    header.id = "header";
    // #header finns i CSS

    header.innerHTML = `
        <a href="feed/index.html">
            <img src="goodFilmsLogo">
        </a>
    `;

    parent.append(header);
}