import { fetcher } from '../../global/logic/fetcher.js';
import { PubSub } from "../../global/logic/PubSub.js";

PubSub.subscribe({
    event: "renderRegister",
    listener: detail => renderRegister(detail)
});

function renderRegister(parentID) {
    const DOM = document.getElementById(parentID);
    DOM.innerHTML = `
    <div id="top">
        <a href="../"><div id="logo">
            <img id="logoImg" src="../../media/icons/logo.svg">
            <h1 id="logoFont">goodFilms</h1>
        </div></a>
    </div>
    <hr id="topLine">
    <div id="bottom">
        <div id="inputFields">
            <input type="text" name="name" placeholder="name" id="name">
            <input type="text" name="username" placeholder="username" id="username">
            <input type="password" name="password" placeholder="password" id="password">
            <input type="password" name="password" placeholder="confirm password" id="confPassword">
        </div>

        <button id="registerBttn">REGISTER</button>
        <h3>Already a memeber? <a id="logInLink" href="../logIn">Log in</a></h3>
        <hr id="bottomLine">
    </div>
    `;

    const registerBttn = document.getElementById("registerBttn");
    registerBttn.addEventListener("click", async () => {
        //....
        let name = document.getElementById("name").value;
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let confPassword = document.getElementById("confPassword").value;

        if (name && username && password === confPassword) {
            //.... skicka request

            let userInfo = {
                displayName: name,
                username: username,
                password: password,
            };

            let registerRqst = new Request("../../api/users.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfo)
            });

            let registerFetch = await fetcher(registerRqst);

            if (registerFetch === undefined) {
                window.alert("Ooops... register failed. Please, try again.");
            }

            //rederict till login!
        }
    });

    const confPassword = document.getElementById("confPassword");
    confPassword.addEventListener("keypress", async (event) => {
        if (event.key === "Enter") {
            let name = document.getElementById("name").value;
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let confPassword = document.getElementById("confPassword").value;

            if (name && username && password === confPassword) {
                //.... skicka request

                let userInfo = {
                    displayName: name,
                    username: username,
                    password: password,
                };

                let registerRqst = new Request("../../api/users.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userInfo)
                });

                let registerFetch = await fetcher(registerRqst);
                if (registerFetch === undefined) {
                    window.alert("Ooops... register failed. Please, try again.");
                }
                //redirect till login!!
            }
        }
    });
}