import {fetcher} from '../../global/logic/fetcher.js';
import {options} from '../../state.js';
import {token} from '../../state.js';
import {PubSub} from '../../global/logic/PubSub.js';

PubSub.subscribe({
    event: "renderEditList",
    listener: renderEditList()
})

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

                            let removeBtn = document.createElement("button");
                            removeBtn.textContent = "Remove";
                            removeBtn.style.backgroundColor = "red";
                            newListContainer.appendChild(removeBtn);

                            bottomContainer.insertBefore(newListContainer, addBox);

                            removeBtn.addEventListener("click", (event) => {
                                
                                let movieID = parseInt(event.target.parentElement.id);
                                
                                console.log(movieID);
                                tempMovieArray.splice(tempMovieArray.indexOf(movieID), 1);
                                console.log(tempMovieArray);
                                event.target.parentElement.remove();
                            })

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

        inputName.value = response.name;
        inputDesc.textContent = response.description;

        let header = document.querySelector("#btnContainer > h1");
        header.textContent = `Edit ${response.name}`;

        let POSTbtn = document.getElementById("POSTbtn");
        POSTbtn.textContent = "Save";
        
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

                let removeBtn = document.createElement("button");
                removeBtn.textContent = "Remove";
                removeBtn.style.backgroundColor = "red";
                newListContainer.appendChild(removeBtn);

                bottomContainer.insertBefore(newListContainer, addBox);

                removeBtn.addEventListener("click", async (event) => {
                    let idOfClicked = parseInt(event.target.parentElement.id);
                    let listID = localStorage.getItem("listID");

                    let DOMtoRemove = document.getElementById(`${idOfClicked}`);
                    DOMtoRemove.remove();

                    let optionsDELETE = {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json"},
                        body: JSON.stringify({"id": parseInt(listID), "movieId": idOfClicked, "token": token})
                    }
                    let rqst = new Request(`../../api/lists.php`, optionsDELETE);
    
                    await fetcher(rqst);                
                });
            }
        }

    }

    let POSTbtn = document.getElementById("POSTbtn");

    POSTbtn.addEventListener("click", async () => {
        

        let inputNameValue = document.querySelector("#listNameInput").value;
        let inputDescValue = document.querySelector("#listDescriptionInput").value;

        if (!localStorage.getItem("listID")) {

            if (inputNameValue !== "" && inputDescValue !== "") {

                let optionsPOST = {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({"name": inputNameValue, "description": inputDescValue, "token": token})
                }

                let rqst = new Request(`../../api/lists.php`, optionsPOST);

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
            let userList = await fetch(`../../api/lists.php?id=${localStorage.getItem("listID")}&user=${token}`); // fetch the LIST
            let response = await userList.json();

            if (response.name !== inputNameValue && response.description !== inputDescValue) {
                let optionsNameDesc = {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({"id": response.id, "name":inputNameValue, "description": inputDescValue, "token": token})
                }

                let rqst = new Request(`../../api/lists.php`, optionsNameDesc);
                fetcher(rqst);

            } else if (response.name !== inputNameValue) {
                let optionsName = {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({"id": response.id, "name":inputNameValue, "token": token})
                }

                let rqst = new Request(`../../api/lists.php`, optionsName);
                fetcher(rqst);

            } else if(response.description !== inputDescValue) {
                let optionsDesc = {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({"id": response.id, "description":inputDescValue, "token": token})
                }

                let rqst = new Request(`../../api/lists.php`, optionsDesc);
                fetcher(rqst);
            }
        }

        if (localStorage.getItem("listID") && tempMovieArray.length !== 0) {
            let rqst = await fetch(`../../api/lists.php?id=${localStorage.getItem("listID")}&user=${token}`);
            let list = await rqst.json();

            let listID = parseInt(localStorage.getItem("listID"));
            let oldListIDs = list.items;

            console.log(list);

            for (let newFilmID of tempMovieArray) {
        
                if (list.backdropPath === "../../media/icons/hello_kitty.png") {
                    const request = new Request(`https://api.themoviedb.org/3/movie/${newFilmID}?language=en-US`, options);
                    let response = await fetcher(request);
                    console.log(response);
                    
                    
                    if (!response.backdrop_path) {
                        continue;
                    }
                    let newBackdrop = response.backdrop_path;
                    console.log(newBackdrop)
                    let optionsPATCH = {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json"},
                        body: JSON.stringify({"id": listID, "backdropPath": newBackdrop, "token": token})
                    }
                    let rqst = new Request(`../../api/lists.php`, optionsPATCH);
    
                    await fetcher(rqst);
                }

                if (oldListIDs.includes(newFilmID)) continue; 

                let optionsPOST = {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({"id": listID, "movieId": newFilmID, "token": token})
                }
                let rqst = new Request(`../../api/lists.php`, optionsPOST);

                await fetcher(rqst);
            }
        }

        localStorage.setItem("list", `../../api/lists.php?id=${localStorage.getItem("listID")}&user=${token}`);

        window.location = '../clickedList/index.html';

    });
}