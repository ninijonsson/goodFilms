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

//lägga till i watched/liked
if ($requestMethod == "POST") {
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    if (isset($requestData["token"]) == false) {
        abort(400, "Bad Request (missing token)");
    }

    $userInfo = getUserFromToken($requestData["token"]);
    $activityKeys = ["action", "movieId"];

    if (requestContainsAllKeys($requestData, $activityKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $userDatabase = getDatabase("users.json");
    for ($i = 0; $i < count($userDatabase); $i++) {
        if ($userDatabase[$i]["username"] == $userInfo["username"]) {
            $userDatabase[$i][$requestData["action"]][] = $requestData["movieId"];
            break;
        }
    }

    $action = $requestData["action"];

    $activity = [
        "movieId" => $requestData["movieId"],
        "userId" => $userInfo["id"],
        "action" => "has $action"
    ];

    $counter = [
        "movieId" => $requestData["movieId"],
        "action" => $requestData["action"]
    ];

    logActivity($activity);
    updateInteractionCount($counter);

    $json = json_encode($userDatabase, JSON_PRETTY_PRINT);
    file_put_contents("users.json", $json);
    send(201, [$activity, $counter]);
}

else if ($requestMethod == "DELETE") {
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    if (isset($requestData["token"]) == false) {
        abort(400, "Bad Request (missing token)");
    }

    $userInfo = getUserFromToken($requestData["token"]);
    $activityKeys = ["action", "movieId"];

    if (requestContainsAllKeys($requestData, $activityKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    if (!$requestData["action"] == "liked" or !$requestData["action"] == "watched") {
        abort(400, "Bad Request (action doesn't exist)");
    }

    $userDatabase = getDatabase("users.json");
    for ($i = 0; $i < count($userDatabase); $i++) {
        if ($userDatabase[$i]["id"] == $userInfo["id"]) {
            for ($ii = 0; $ii < count($userDatabase[$i][$requestData["action"]]); $ii++) {
                if ($userDatabase[$i][$requestData["action"]][$ii] == $requestData["movieId"]){
                    array_splice($userDatabase[$i][$requestData["action"]], $ii, 1);
                    break;
                }
            }
        }
    }

    $json = json_encode($userDatabase, JSON_PRETTY_PRINT);
    file_put_contents("users.json", $json);
    send(201, "removed");
}
?>