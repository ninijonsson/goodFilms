import { extractNumbersFromString } from "../../global/logic/getNumFromStr";

function clickedList (event) {
    const container = document.querySelector("#wrapper");

    let idOfClickedList = extractNumbersFromString(event.target.id);

    let lists = _state.lists;

    let listToRender = lists.find(list => list.id === idOfClickedList);

    container.innerHTML = ` <div id="topContainer">
                                <h1 id="listName"></div>
                                <p id="description"></p>
                                <p id="createdBy"></p>
                            </div>
                            <div id="bottomContainer"></div>
    `;

    const listDisplay = document.querySelector("#bottomContainer");

    let movieArray = [];

    listToRender.items.forEach(list => movieArray.push(list));

    movieArray.forEach((movie) => {
        let singleMovie = document.createElement("img");
        singleMovie.class = "movie";
        singleMovie.src = `https://image.tmdb.org/t/p/original/${movies.results[i].poster_path}`;
        // ================= Fix poster path depending on DB

        listDisplay.appendChild(singleMovie);

        singleMovie.addEventListener("click", renderMovie);
    })
}