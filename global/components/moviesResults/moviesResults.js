const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

const wrapper = document.getElementById("wrapper");

wrapper.innerHTML = `
    <h1 id="title">SHOWING ONLY MOVIES</h1>
    <hr>
    <select>SORT BY</select>

    <div id="moviesContainer"></div>
`;

if (window.localStorage.getItem("movieQuery")) {
    let query = window.localStorage.getItem("movieQuery");
    console.log(query);
    const response = await fetch(query, options);
    const filteredMovies = await response.json();

    const moviesContainer = document.getElementById("moviesContainer");

    for (let i = 0; i < 20; i++) {
        moviesContainer.innerHTML += `
            <img class="movie" src="https://image.tmdb.org/t/p/original/${filteredMovies.results[i].poster_path}">
        `;
    }
}

export function renderResults(filteredMovies) {
    window.location = "../moviesResults/index.html";

    console.log(filteredMovies.results);

    // Bilderna på filmerna
    const moviesContainer = document.getElementById("moviesContainer");

    console.log(moviesContainer);

    for (let i = 0; i < 9; i++) {
        moviesContainer.innerHTML += `
            <img class="movie" src="https://image.tmdb.org/t/p/original/${filteredMovies.results[i].poster_path}">
        `;
    }
}