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

//följa någon
if ($requestMethod == "POST") {
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    if (isset($requestData["token"]) == false) {
        abort(400, "Bad Request (missing token)");
    }

    $userInfo = getUserFromToken($requestData["token"]);
    $followKeys = ["id"]; //personens (som man vill följa) ID

    if (requestContainsAllKeys($requestData, $followKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $userDatabase = getDatabase("users.json");
    for ($i = 0; $i < count($userDatabase); $i++) {
        if ($userDatabase[$i]["id"] == $userInfo["id"]) {
            $userDatabase[$i]["following"][] = $requestData["id"];
            break;
        }
    }

    for ($i = 0; $i < count($userDatabase); $i++) {
        if ($userDatabase[$i]["id"] == $requestData["id"]) {
            $userDatabase[$i]["followers"][] = $userInfo["id"];
            break;
        }
    }

    $json = json_encode($userDatabase, JSON_PRETTY_PRINT);
    file_put_contents("users.json", $json);
    send(201, $userDatabase);

    $activity = [
        "followedId" => $requestData["id"],
        "userId" => $userInfo["id"],
        "action" => "has followed"
    ];

    logActivity($activity);
}

//ta bort follow
else if ($requestMethod == "DELETE") {
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    if (isset($requestData["token"]) == false) {
        abort(400, "Bad Request (missing token)");
    }

    $userInfo = getUserFromToken($requestData["token"]);
    $followKeys = ["id"]; //personens (som man vill följa) ID

    if (requestContainsAllKeys($requestData, $followKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $userDatabase = getDatabase("users.json");
    for ($i = 0; $i < count($userDatabase); $i++) {
        if ($userDatabase[$i]["id"] == $userInfo["id"]) {

            for ($ii = 0; $ii < count($userDatabase[$i]["following"]); $ii++) {
                if ($userDatabase[$i]["following"][$ii] == $requestData["id"]){
                    array_splice($userDatabase[$i]["following"], $ii, 1);
                    break;
                }
            }
        }
    }

    for ($i = 0; $i < count($userDatabase); $i++) {
        if ($userDatabase[$i]["id"] == $requestData["id"]) {

            for ($ii = 0; $ii < count($userDatabase[$i]["followers"]); $ii++) {
                if ($userDatabase[$i]["followers"][$ii] == $userInfo["id"]){
                    array_splice($userDatabase[$i]["followers"], $ii, 1);
                    break;
                }
            }
        }
    }

    $json = json_encode($userDatabase, JSON_PRETTY_PRINT);
    file_put_contents("users.json", $json);
    send(201, $userDatabase);
}
?>