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
    $activityDatabase = getDatabase("activity.json");

    if (isset($_GET["user"])) {
    
        $userInfo = getUserFromToken($_GET["user"]);
        $following = $userInfo["following"];

        $relevantActivity = [];
        foreach ($activityDatabase as $activity) {
            foreach($following as $user) {
                if ($activity["userId"] == $user) {
                    $relevantActivity[] = $activity;
                }
            }
        }

        send(201, $relevantActivity);
    }

    send(201, $activityDatabase);
}
?>