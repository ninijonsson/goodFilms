function renderHeader() {
    const header = document.createElement("div");
    header.id = "header";
    // #header finns i CSS

    header.innerHTML = `
        <div id="hamburgerMenu">${renderHamburgerMenu()}</div>
        <a href="feed/index.html">
            <img src="goodFilmsLogo">
        </a>
    `;
}