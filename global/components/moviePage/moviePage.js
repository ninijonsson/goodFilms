// Gör om till global variabel
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZjJhYjRlMGQ2MWMxY2MxNDUzOTVmYjhmYWI1ZGZiMSIsInN1YiI6IjY2MThmMDVjMTA5Y2QwMDE2NWEzODEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nj98FemKpT0B2H3wU6gj47MrwtNhMTHRQ4Z3om_-I5E"
    }
};

const wrapper = document.getElementById("wrapper");

if (window.localStorage.getItem("movieInfo")) {
    let info = window.localStorage.getItem("movieInfo");
    console.log(info);
    const response = await fetch(info, options);
    const movie = await response.json();

    wrapper.innerHTML = `
    <div id="movieContainer">
        <img id="backdropPoster" src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}">

        <div id="movieInformationContainer">
            <h1 id="movieTitle">${movie.title}</h1>
            <h2 id="releaseYear">${movie.release_date.slice(0, 4)}</h2>
            <h2 id="directedBy">DIRECTED BY ${movie.production_companies[0].name.toUpperCase()}</h2>
            <p id="movieDescription">${movie.overview}</p>
            <img id="moviePoster" src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
        </div>

        <div id="likedAndWatchedContainer">
            <img id="heartUnliked" src="">
            <button id="watchedButton" type="submit">WATCH</button>
        </div>

        <h3 id="includedInText">INCLUDED IN</h3>
        <hr>

        <div id="listsContainer">
            <div class="listContainer">
                <img class="moviePoster" src="">
                <h4 class="listName">LIST NAME</h4>
                <p id="listDescription">Information about this list.</p>
            </div>
        </div>

    </div>
`;
}

