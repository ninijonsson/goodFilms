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

// NOTE: this endpoint is copied to "login.php" and moved to
// a POST method instead (as it makes more sense than a GET)

// if ($requestMethod == "GET") // Login (name + password)
// {
//     if (empty($requestData)) {
//         abort(400, "Bad Request (empty request)");
//     }

//     $loginKeys = ["name", "password"];

//     if (requestContainsAllKeys($requestData, $loginKeys) == false) {
//         abort(400, "Bad Request (missing keys)");
//     }

//     $name = $requestData["name"];
//     $user = findItemByKey("users", "name", $name);

//     if ($user == false) {
//         abort(404, "User Not Found");
//     }

//     if ($user["password"] != $requestData["password"]) {
//         abort(400, "Bad Request (invalid password)");
//     }

//     // This token is used to authenticate future requests
//     $token = ["token" => sha1($name + $password)];
//     send(200, $token);
// }
// else if ($requestMethod == "POST") // Register a new user

if ($requestMethod == "POST") // Register a new user
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    $userKeys = ["username", "name", "password"];

    if (requestContainsAllKeys($requestData, $userKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $username = $requestData["username"];
    $user = findItemByKey("users.json", "username", $username);
    
    if ($user != false) {
        abort(400, "Bad Request (user already exists)");
    }

    $newUser = insertItemByType("users", $userKeys, $requestData);
    unset($newUser["password"]);
    send(201, $newUser);
}
else if ($requestMethod == "DELETE") // Delete an user account (token required)
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    if (isset($requestData["token"]) == false) {
        abort(400, "Bad Request (missing token)");
    }
    
    $user = getUserFromToken($requestData["token"]);

    if ($user == false) {
        abort(400, "Bad Request (invalid token)");
    }

    // Clean up games/characters the user created and/or liked
    removeUserGamesCharactersAndLikes($user["id"]);

    $deletedUser = deleteItemByType("users", $user);
    unset($newUser["password"]);
    send(200, $deletedUser);
}
else
{
    abort(405, "Method Not Allowed");
}

?>