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
    send(201, $userDatabase);
}

else if ($requestMethod == "POST") // Register a new user
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    $userKeys = ["name", "name", "password"];

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
        "avatar" => "",
        "header" => ""
    ];

    foreach ($extraValuesForANewUser as $key => $value) {
        $userKeys[] = $key;
        $requestData[$key] = $value;
    }

    $newUser = insertItemByType("users.json", $userKeys, $requestData);
    unset($newUser["password"]);
    send(201, $newUser);
}

else if ($requestMethod == "PATCH")
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    $tokenKey = ["token"];

    if (requestContainsAllKeys($requestData, $tokenKey) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $user = getUserFromToken($requestData["token"]);

    // Make sure that the "liker" (user_id) is the same as the owner of the token
    if ($user == false) {
        abort(400, "Bad Request (invalid token)");
    }
    
    $list = findItemByKey("lists.json", "id", $requestData["id"]);

    if ($list == false) {
        abort(404, "List Not Found");
    }

    // Change "name"
    if (isset($requestData["name"])) {
        $list["name"] = $requestData["name"];
    }

    // Change "description"
    if (isset($requestData["description"])) {
        $list["description"] = $requestData["description"];
    }

    $updatedList = updateItemByType("lists.json", $list);
    send(200, $updatedList);
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