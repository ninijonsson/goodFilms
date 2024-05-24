import { PubSub } from "../../global/logic/PubSub.js";
import { STATE } from "../../state.js";
import { fetcher } from "../../global/logic/fetcher.js";
import { options } from "../../state.js";

PubSub.subscribe({
    event: "renderClickedList",
    listener: (detail) => renderClickedList(detail)
});

async function renderClickedList(parentID) {
    const wrapper = document.getElementById(parentID);

    const listRequest = localStorage.getItem("list");
    const request = new Request(listRequest);
    const list = await fetcher(request);

    wrapper.innerHTML = `
        <div id="upperContainer">
            <h1 id="listName">${list.name.toUpperCase()}</h1>
            <h3 id="listDescription">${list.description.toUpperCase()}</h3>
            <h4 id="createdBy">CREATED BY: <span>${list.createdBy.toUpperCase()}</span></h4>
        </div>

        <hr>

        <div id="listContainer"></div>
    `;

    const listContainer = document.getElementById("listContainer");

    for (let i = 0; i < list.items.length; i++) {
        const rqst = new Request(`https://api.themoviedb.org/3/movie/${list.items[i]}?language=en-US`, options);
        const movie = await fetcher(rqst);

        console.log(movie);

        listContainer.innerHTML += `
            <img class="movie" id="${list.items[i]}" src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
        `;
    }

    listContainer.addEventListener("click", async (event) => {
        console.log(event);
        if (event.target.classList.contains("movie")) {
            const movieId = event.target.id;

            window.localStorage.setItem("movieInfo", `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`);

            window.location = "../moviePage/index.html";
        }
    });

    // let idOfClickedList = extractNumbersFromString(event.target.id);

    // let lists = _state.lists;

    // let listToRender = lists.find(list => list.id === idOfClickedList);

    // container.innerHTML = ` <div id="topContainer">
    //                             <h1 id="listName"></div>
    //                             <p id="description"></p>
    //                             <p id="createdBy"></p>
    //                         </div>
    //                         <div id="bottomContainer"></div>
    // `;

    // const listDisplay = document.querySelector("#bottomContainer");

    // let movieArray = [];

    // listToRender.items.forEach(list => movieArray.push(list));

    // movieArray.forEach((movie) => {
    //     let singleMovie = document.createElement("img");
    //     singleMovie.class = "movie";
    //     singleMovie.src = `https://image.tmdb.org/t/p/original/${movies.results[i].poster_path}`;
    //     // ================= Fix poster path depending on DB

    //     listDisplay.appendChild(singleMovie);

    //     singleMovie.addEventListener("click", renderMovie);
    // })
}