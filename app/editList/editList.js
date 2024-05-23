import {fetcher} from '../../global/logic/fetcher.js';

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

const token = "c62f39ace22172680875af13e02f6a6313ea1125";

async function renderEditList () {
    const container = document.getElementById("wrapper");
    let tempMovieArray = [];

    container.innerHTML = `
    <div id="topContainer">

        <div id="btnContainer">
            <h1>CREATE NEW LIST</h1>
            <button id="POSTbtn">POST</button>
        </div>
        <div id="inputContainer">
            <input id="listNameInput" placeholder="Name" type="text">
            <textarea id="listDescriptionInput" placeholder="Description"></textarea>
        </div>

    </div>

    <div id="bottomContainer">
        <div id="addBox">
            <img id="add" src="../../media/icons/add-box.svg">
        </div>
    </div>
    `;

    const bottomContainer = document.getElementById("bottomContainer");

    const addBtn = document.getElementById("add");

    addBtn.addEventListener("click", () => {
        let parent = document.querySelector("#wrapper");

        let popupBackdrop = document.createElement("div");
        popupBackdrop.id = "popupBackdrop";

        popupBackdrop.innerHTML = `
                                <div id="popupBox">
                                    <div id="X">X</div>
                                    <input id="searchBar" placeholder="Search for a movie">
                                    <div id="resultDisplay"></div>
                                </div>
        `;

        parent.appendChild(popupBackdrop);

        let X = document.getElementById("X");

        let searchBar = document.getElementById("searchBar");

        searchBar.addEventListener("keypress", async (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                const resultDisplay = document.getElementById("resultDisplay");
                resultDisplay.innerHTML = ``;
    
                const movieInput = event.target.value.toLowerCase();
    
                const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieInput}&include_adult=false&language=en-US&page=1`, options);
    
                const movies = await response.json();
    
                // Om "movies"-arrayen är tom, meddela användaren
                if (movies.results.length === 0) {
                    resultDisplay.innerHTML = `<p>No movies found</p>`;
                }

                for (let movie of movies.results) {
                    
                    if (movie.poster_path) {
                        let movieBox = document.createElement("img");
                        movieBox.id = movie.id;

                        movieBox.src = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
                        resultDisplay.appendChild(movieBox);

                        movieBox.addEventListener("click", () => {
                            let idOfMovie = parseInt(movieBox.id);
                            tempMovieArray.push(idOfMovie);

                            let addBox = document.getElementById("addBox");

                            let newListContainer = document.createElement("div");
                            newListContainer.id = movieBox.id;
                            let newListItem = document.createElement("img");
                            newListItem.src = movieBox.src;
                            newListContainer.appendChild(newListItem);
                            bottomContainer.insertBefore(newListContainer, addBox);

                            popupBackdrop.remove();

                            console.log(tempMovieArray);
                            console.log(bottomContainer);
                            
                        });

                    } else {
                        continue;
                    }

                    if (!resultDisplay.innerHTML) {
                        resultDisplay.innerHTML = `<p>No movies found</p>`;
                    }
                }
            }
        })

        X.addEventListener("click", () => {
            popupBackdrop.remove();
        });
    });

    if (localStorage.getItem("listID")) {

        let userList = await fetch(`../../api/lists.php?id=${localStorage.getItem("listID")}&user=${token}`); // fetch the LIST
        let response = await userList.json();
        console.log(response);
        let inputName = document.getElementById("listNameInput");
        let inputDesc = document.getElementById("listDescriptionInput");

        let inputNameAtStart = response.name;
        let inputDescAtStart = response.description;

        inputName.value = response.name;
        inputDesc.textContent = response.description;

        let header = document.querySelector("#btnContainer > h1");
        header.textContent = `Edit ${response.name}`;
        
        for (let movieID of response.items) {
            const request = new Request(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options);
            let response = await fetcher(request);

            if (!response) {
                continue;
            } else {

                console.log(response);
                let idOfMovie = movieID;

                let addBox = document.getElementById("addBox");

                let newListContainer = document.createElement("div");
                newListContainer.id = movieID;
                let newListItem = document.createElement("img");
                newListItem.src = `https://image.tmdb.org/t/p/original/${response.poster_path}`;
                newListContainer.appendChild(newListItem);
                bottomContainer.insertBefore(newListContainer, addBox);
            }
        }

    }

    let POSTbtn = document.getElementById("POSTbtn");

    POSTbtn.addEventListener("click", async () => {
        if (!localStorage.getItem("listID")) {

            let inputNameValue = document.querySelector("#listNameInput").value;
            let inputDescValue = document.querySelector("#listDescriptionInput").value;

            if (inputNameValue !== "" && inputDescValue !== "") {

                let options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({"name": inputNameValue, "description": inputDescValue, "token": token})
                }

                let rqst = new Request(`../../api/lists.php`, options);

                let response = await fetcher(rqst);

                localStorage.setItem("listID", response.id)
            } else {
                let cont = document.getElementById("inputContainer");
                let warningText = document.createElement("p");
                warningText.style.color = "red";
                warningText.textContent = "Fill in both fields";
                cont.appendChild(warningText);
            }
        } else {
            
        }

        if (localStorage.getItem("listID") && tempMovieArray !== []) {
            let rqst = await fetch(`../../api/lists.php?id=${localStorage.getItem("listID")}&user=${token}`);
            let list = await rqst.json();

            let listID = parseInt(localStorage.getItem("listID"));
            let oldListIDs = list.items;

            console.log(list);

            for (let newFilmID of tempMovieArray) {
                if (oldListIDs.includes(newFilmID)) continue; 

                let options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({"id": listID, "movieId": newFilmID, "token": token})
                }
                let rqst = new Request(`../../api/lists.php`, options);

                await fetcher(rqst);
            
            }

        }
    });
}

renderEditList();