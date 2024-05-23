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

if ($requestMethod == "GET") {

    $userDatabase = getDatabase("users.json");

    if (isset($_GET["user"])) {
        $userInfo = getUserFromToken($_GET["user"]);

        if (isset($_GET["profile"])) {
            foreach ($userDatabase as $user) {
                if ($user["id"] == $_GET["profile"]) {
                    send(201, $user);
                }
            }
        }
        
        foreach ($userDatabase as $user) {
             if ($user["id"] == $userInfo["id"]){
                send(201, $user);
            }
        }
    }

    send(201, $userDatabase);
}

else if ($requestMethod == "POST") // Register a new user
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    $userKeys = ["username", "displayName", "password"];

    if (requestContainsAllKeys($requestData, $userKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $username = $requestData["username"];
    $user = findItemByKey("users.json", "username", $username);
    
    if ($user != false) {
        abort(400, "Bad Request (user already exists)");
    }

    $extraValuesForANewUser = [
        "liked" => [],
        "watched" => [],
        "lists" => [],
        "following" => [],
        "followers" => [],
        "avatar" => "..\/..\/media\/icons\/profile_picture.png",
        "header" => "..\/..\/media\/icons\/test_backdrop_profile.jpeg"
    ];

    foreach ($extraValuesForANewUser as $key => $value) {
        $userKeys[] = $key;
        $requestData[$key] = $value;
    }

    $newUser = insertItemByType("users.json", $userKeys, $requestData);
    unset($newUser["password"]);
    send(201, $newUser);
}

else if ($requestMethod == "PATCH")  // Change "display name"
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    $userKeys = ["displayName", "token"];

    if (requestContainsAllKeys($requestData, $userKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $user = getUserFromToken($requestData["token"]);

    if ($user == false) {
        abort(400, "Bad Request (invalid token)");
    }
    
    if (isset($requestData["displayName"])) {
        $user["displayName"] = $requestData["displayName"];
    }

    $updatedUser = updateItemByType("users.json", $user);
    send(200, $updatedUser);
}

else if ($requestMethod == "DELETE") // Delete an account (token required)
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
    removeUserLists($user["username"]);

    $deletedUser = deleteItemByType("users.json", $user);
    unset($deletedUser["password"]);
    send(200, $deletedUser);
}
else
{
    abort(405, "Method Not Allowed");
}
?>