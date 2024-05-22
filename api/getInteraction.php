<?php
require_once("helpers.php");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Origin: *");
    exit();
} else {
    header("Access-Control-Allow-Origin: *");
}

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "GET") {
    $interactionDatabase = getDatabase("interaction.json");

    if (isset($_GET["movieId"])) {
        $id = intval($_GET["movieId"]);

        foreach ($interactionDatabase as $movie) {
            if ($movie["movieId"] == $id) {
                send(201, $movie);
            }
        }
        abort(404, "Not found: The movie ID couldn't be found");
    }

    else {
        abort(400, "Bad Request: Missing parameters");
    }
}
?>