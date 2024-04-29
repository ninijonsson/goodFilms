function renderHamburgerMenu(parentID) {
    const parent = document.getElementById(parentID);

    parent.innerHTML = `
        <div id="hamburgerContainer">
            <img id="hamburgerMenu" src=""> // Hamburger menu as img?
        </div>
    `;

    const hamburgerMenu = document.getElementById("hamburgerMenu");

    hamburgerMenu.addEventListener("click", () => {
        // Gör så att hamburgarmenyn öppnas och kunna klicka till alla de olika sidorna
    });
}