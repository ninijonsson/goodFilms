function renderLandingPage (parentID) {
    const DOM = document.getElementById(parentID);
    DOM.innerHTML = `
    <div id="top">
        <img id="logo" src="">
        <p id="descriptionTxt">DESCRIPTIONDESCRIPTIONDESCRIPTIONDESCRIPTION</p>
    </div>
    <div id="middle">
        <button id="join">JOIN US NOW!</button>
        <h2>Already a member? <a id="logInLink" href="">Log in</a></h2>
    </div>
    <div id="bottom">
        <h6>NEED A MOVIE TO WATCH? WE GOT YOU!</h6>
        <div id="suggestMovies"></div>
        <h6>ALREADY SEEN THESE? <a id="searchMoreLink" href="">SEARCH FOR MORE</a></h6>
    </div>
    `;

    const joinBttn = document.getElementById("join");
    joinBttn.addEventListener("click", () => {
        window.location = "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a";
    });

    // const logInBttn = document.getElementById("logInLink");
    // logInBttn.addEventListener("click", () => {
    //     //....
    // });

    // const searchMoreBttn = document.getElementById("searchMoreLink");
    // searchMoreBttn.addEventListener("click", () => {
    //     //....
    // })


}