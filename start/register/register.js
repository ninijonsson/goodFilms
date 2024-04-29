function renderRegister (parentID) {
    const DOM = document.getElementById(parentID);
    DOM.innerHTML = `
    <div id="top">
        <img id="logo" src="">
    </div>
    <div id="bottom>
        <input type="text" name="name" placeholder="name">
        <input type="text" name="username" placeholder="username">
        <input type="password" name="password" placeholder="password">
        <input type="password" name="password" placeholder="confirm password">

        <button id="registerBttn">REGISTER</button>
        <h3>Already a memeber? <a id="logInLink" href="">Log in</a></h3>
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