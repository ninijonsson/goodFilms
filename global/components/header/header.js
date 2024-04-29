function renderHeader(parentID) {
    const parent = document.getElementById(parentID);

    const header = document.createElement("div");
    header.id = "header";
    // #header finns i CSS

    header.innerHTML = `
        <div id="hamburgerMenu">${renderHamburgerMenu(header)}</div>
        <a href="feed/index.html">
            <img src="goodFilmsLogo">
        </a>
    `;

    parent.append(header);
}