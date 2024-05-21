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
$requestData = getRequestData();

if ($requestMethod == "GET") // Get one or all games
{
    if (isset($requestData["id"])) {
        $id = $requestData["id"];
        $game = findItemByKey("games", "id", $id);
        
        if ($game == false) {
            abort(404, "Game Not Found");
        }
        
        send(200, $game);
    }

    $user = getUserFromToken($requestData["token"]);

    $games = getDatabaseByType("games");
    foreach ($games as $index => &$game) {
        if ($game["user_id"] != $user["id"]) {
            array_splice($games, $index, 1);
        }
    }
    send(200, $games);
}
else if ($requestMethod == "POST") // Create a new game (token required)
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    $gameKeys = ["token", "name", "rating", "favorite"];

    if (requestContainsAllKeys($requestData, $gameKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $user = getUserFromToken($requestData["token"]);

    // Make sure that the creator (user_id) is the same as the owner of the token
    if ($user == false) {
        abort(400, "Bad Request (invalid token)");
    }

    $game = findItemByKey("games", "name", $requestData["name"]);
 
    if ($game != false) {
        abort(400, "Bad Request (game already exists)");
    }

    $gameKeys[] = "user_id";
    $requestData["user_id"] = $user["id"];
    $newGame = insertItemByType("games", $gameKeys, $requestData);
    send(201, $newGame);
}
else if ($requestMethod == "PATCH") // Like or unlike a movie (token required)
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    $likeKeys = ["id", "token"];

    if (requestContainsAllKeys($requestData, $likeKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $user = getUserFromToken($requestData["token"]);

    // Make sure that the "liker" (user_id) is the same as the owner of the token
    if ($user == false) {
        abort(400, "Bad Request (invalid token)");
    }
    
    $game = findItemByKey("games", "id", $requestData["id"]);

    if ($game == false) {
        abort(404, "Game Not Found");
    }

    // Toggle the user "favorite"
    if (isset($requestData["favorite"])) {
        if ($game["favorite"] == false) {
            $game["favorite"] = true;
        } else {
            $game["favorite"] = false;
    
        }
    }

    // Change "rating"
    if (isset($requestData["rating"])) {
        $game["rating"] = $requestData["rating"];
    }

    $updatedGame = updateItemByType("games", $game);
    send(200, $updatedGame);
}
else if ($requestMethod == "DELETE") // Delete a game (token required)
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    $deleteKeys = ["id", "token"];

    if (requestContainsAllKeys($requestData, $deleteKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $game = findItemByKey("games", "id", $requestData["id"]);

    if ($game == false) {
        abort(404, "Game Not Found");
    }

    $user = getUserFromToken($requestData["token"]);

    if ($user == false) {
        abort(400, "Bad Request (invalid token)");
    }

    if ($user == false || $game["user_id"] != $user["id"]) {
        abort(400, "Bad Request (invalid token)");
    }

    $deletedGame = deleteItemByType("games", $game);
    send(200, $deletedGame);
}
else
{
    abort(405, "Method Not Allowed");
}

?>