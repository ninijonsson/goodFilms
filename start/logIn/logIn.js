import {fetcher} from '../../global/logic/fetcher.js';

function renderLogIn (parentID) {
    const DOM = document.getElementById(parentID);
    DOM.innerHTML = `
    <div id="top">
        <div id="logo">
            <img id="logoImg" src="../../media/icons/logo.svg">
            <h1 id="logoFont">goodFilms</h1>
        </div>
    </div>
    <hr id="topLine">
    <div id="bottom">
        <div id="inputFields">
            <input type="text" name="username" placeholder="username" id="username">
            <input type="password" name="password" placeholder="password" id="password">
        </div>

        <button id="logIn">LOG IN</button>
        <h3>Not a memeber? <a id="registerLink" href="../start/register">Register</a></h3>
        <hr id="bottomLine">
    </div>
    `;

    // const registerBttn = document.getElementById("registerBttn");
    // registerBttn.addEventListener("click", () => {
    //     // omdirigera till registersidan
    // })

    const logInBttn = document.getElementById("logIn");
    logInBttn.addEventListener("click", async () => {
        let username = await document.getElementById("username").value;
        let password = await document.getElementById("password").value;

        if (username && password) {
            let userInfo = {
                username: username,
                password: password,
            };

            let logInRqst = new Request ("../../api/login.php", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(userInfo)
            });
    
            let logInFetch = await fetcher(logInRqst);

            if (logInFetch === undefined) {
                window.alert("Ooops... login failed. Please, check that your username and password are correct.");
            }

            let logInToken = await logInFetch.token;
            localStorage.setItem("token", logInToken);

            //pubSub Logged In Feed elr. window.location = "path/länk";
        }
    });

    const passwordInput = document.getElementById("password");
    passwordInput.addEventListener("keypress", async (event) => {
        if (event.key === "Enter") {
            let username = await document.getElementById("username").value;
            let password = await document.getElementById("password").value;
    
            if (username && password) {
                let userInfo = {
                    username: username,
                    password: password,
                };
    
                let logInRqst = new Request ("../../api/login.php", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(userInfo)
                });
        
                let logInFetch = await fetcher(logInRqst);

                if (logInFetch === undefined) {
                    window.alert("Ooops... login failed. Please, check that your username and password are correct.");
                }

                let logInToken = await logInFetch.token;
                localStorage.setItem("token", logInToken);

                //pubSub Logged In Feed elr. window.location = "path/länk";
                
            }
        }
    });
    
}

renderLogIn("wrapper");