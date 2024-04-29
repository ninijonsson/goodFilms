function renderFeed(parentID) {
    const parent = document.getElementById(parentID);

    parent.innerHTML = `
        <h1 id="welcomeText">WELCOME, <span>MEMBER!</span></h1>

        <div id="activityFeed">
            <h2>ACTIVITY FROM FRIENDS</h2>
            <hr>

            <div class="movie">
                <img id="moviePoster" src=""></img>
                <img id="profilePicture" src=""></img>
                <p id="username"></p>
                <p id="statusText"></p>
            </div>
        </div>

        <div id="newLists">
            <div class="list">
                <img id="listPoster_1" src=""></img>
                <h3 id="listName_1">List name</h3>
                <p id="listDescription"></p>
                <img id="profilePicture_1></img>
                <p id="username_1></p>
            </div>
        </div>
    `;
}