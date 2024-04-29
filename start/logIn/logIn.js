function renderLogIn (parentID) {
    const DOM = document.getElementById(parentID);
    DOM.innerHTML = `
    <div id="top">
        <img id="logo" src="">
    </div>
    <div id="bottom>
        <input type="text" name="name" placeholder="name">
        <input type="password" name="password" placeholder="password">

        <button id="logInBttn">LOG IN</button>
        <h3>Not a memeber? <a id="registerLink" href="">Register</a></h3>
    </div>
    `;

    const registerBttn = document.getElementById("registerBttn");
    registerBttn.addEventListener("click", () => {
        //....
    })

    const logInBttn = document.getElementById("logInLink");
    logInBttn.addEventListener("click", () => {
        //....
    });
}