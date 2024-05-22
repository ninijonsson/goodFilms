function renderLogIn (parentID) {
    const DOM = document.getElementById(parentID);
    DOM.innerHTML = `
    <div id="top">
        <img id="logoImg" src="../../media/icons/logo.svg">
        <h1 id="logoFont">goodFilms</h1>
    </div>
    <hr>
    <div id="bottom">
        <input type="text" name="username" placeholder="username" id="username">
        <input type="password" name="password" placeholder="password" id="password">

        <button id="logInBttn">LOG IN</button>
        <h3>Not a memeber? <a id="registerLink" href="../register">Register</a></h3>
    </div>
    <hr>
    `;

    // const registerBttn = document.getElementById("registerBttn");
    // registerBttn.addEventListener("click", () => {
    //     // omdirigera till registersidan
    // })

    const logInBttn = document.getElementById("logInBttn");
    logInBttn.addEventListener("click", async () => {
        let username = await document.getElementById("username").value;
        let password = await document.getElementById("password").value;

        if (username && password) {
            console.log("hej");
            let userInfo = {
                username: username,
                password: password,
            };
    
            let logInRqst = new Request(`api/login.php`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(userInfo)
            });
    
            let logInFetch = await fetcher(logInRqst);
            let logInToken = await logInFetch.token;
        }
    });
}

renderLogIn("wrapper");