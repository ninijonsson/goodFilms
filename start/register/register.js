function renderRegister (parentID) {
    const DOM = document.getElementById(parentID);
    DOM.innerHTML = `
    <div id="top">
        <img id="logo" src="">
    </div>
    <div id="bottom>
        <input type="text" name="name" placeholder="name" id="name">
        <input type="text" name="username" placeholder="username" id="username">
        <input type="password" name="password" placeholder="password" id="password">
        <input type="password" name="password" placeholder="confirm password" id="confPassword">

        <button id="registerBttn">REGISTER</button>
        <h3>Already a memeber? <a id="logInLink" href="">Log in</a></h3>
    </div>
    `;

    const registerBttn = document.getElementById("registerBttn");
    registerBttn.addEventListener("click", () => {
        //....
        let name = document.getElementById("namr").value;
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let confPassword = document.getElementById("confPassword").value;

        if (name && username && password === confPassword) {
            //.... skicka request
        }
    })

    const logInBttn = document.getElementById("logInLink");
    logInBttn.addEventListener("click", () => {
        //.... omdirigera till loginsidan
    });
}