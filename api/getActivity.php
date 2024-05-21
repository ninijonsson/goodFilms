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
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    if (!isset($requestData["token"])) {
        abort(400, "Bad Request (missing token)");
    }

    $userInfo = getUserFromToken($requestData["token"]);
    $activityDatabase = getDatabase("activity.json");

    $relevantActivity = [];
    foreach ($activityDatabase as $activity) {
        if ($activity["userId"] == $userInfo["id"]) {
            $relevantActivity[] = $activity;
        }
    }

    send(201, $relevantActivity);
}
?>