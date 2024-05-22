<?php

function send($status = 200, $data = [])
{
    header("Content-Type: application/json");
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function abort($status = 400, $message = "")
{
    send($status, ["error" => $message]);
}

function getRequestData()
{
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $json = file_get_contents("php://input");
        return json_decode($json, true);
        return $_GET;
    }

    if ($_SERVER["CONTENT_TYPE"] != "application/json") {
        abort(400, "Bad Request (invalid content type)");
    }

    $json = file_get_contents("php://input");
    return json_decode($json, true);
}

function getDatabase($filename)
{
    // Incase the database does not exist, or is empty, we'll default to this
    $emptyDatabaseTemplate = json_encode([], JSON_PRETTY_PRINT);

    if (file_exists($filename) == false) {
        file_put_contents($filename, $emptyDatabaseTemplate);
    }

    $databaseContents = file_get_contents($filename);

    if ($databaseContents == "") {
        file_put_contents($filename, $emptyDatabaseTemplate);
    }
    
    $databaseContents = file_get_contents($filename);
    $databaseData = json_decode($databaseContents, true);
    
    if (is_array($databaseData) == false) {
        abort(500, "Internal Server Error (invalid database)");
    }

    return $databaseData;
}

function requestContainsAllKeys($data, $keys)
{
    foreach ($keys as $key) {
        if (isset($data[$key]) == false) {
            return false;
        }
    }

    return true;
}

function requestContainsSomeKey($data, $keys)
{
    foreach ($keys as $key) {
        if (isset($data[$key])) {
            return true;
        }
    }

    return false;
}

function findItemByKey($filename, $key, $value)
{
    $database = getDatabase($filename);
    
    if (!$database) {
        abort(500, "Internal Server Error (database type '$type' does not exist)");
    }

    $databaseByType = $database;

    foreach ($databaseByType as $item) {
        if (isset($item[$key]) && $item[$key] == $value) {
            return $item;
        }
    }

    return false;
}

function insertItemByType($filename, $keys, $data)
{
    $database = getDatabase($filename);
    
    if (!$database) {
        abort(500, "Internal Server Error (database type '$filename' does not exist)");
    }

    $newItem = [];

    foreach ($keys as $key) {
        if ($key == "token") {
            continue;
        }
        $newItem[$key] = $data[$key];
    }

    $id = 0;

    foreach ($database as $item) {
        if (isset($item["id"]) && $item["id"] > $id) {
            $id = $item["id"];
        }
    }

    $newItem["id"] = $id + 1;
    $database[] = $newItem;
    $json = json_encode($database, JSON_PRETTY_PRINT);
    file_put_contents($filename, $json);
    return $newItem;
}

function updateItemByType($filename, $updatedItem)
{
    $database = getDatabase($filename);
    
    if (!$database) {
        abort(500, "Internal Server Error (database type '$type' does not exist)");
    }

    //$databaseByType = $database[$type];

    foreach ($database as $index => $item) {
        if (isset($item["id"]) && $item["id"] == $updatedItem["id"]) {
            $database[$index] = $updatedItem;
        }
    }

    //$database[$type] = $databaseByType;
    $json = json_encode($database, JSON_PRETTY_PRINT);
    file_put_contents($filename, $json);
    return $updatedItem;
}

function deleteItemByType($filename, $itemToDelete)
{
    $database = getDatabase($filename);
    
    if (!$database) {
        abort(500, "Internal Server Error (database file '$filename' does not exist)");
    }

    foreach ($database as $index => $item) {
        if (isset($item["id"]) && $item["id"] == $itemToDelete["id"]) {
            array_splice($database, $index, 1);
        }
    }

    $json = json_encode($database, JSON_PRETTY_PRINT);
    file_put_contents($filename, $json);
    return $itemToDelete;
}

function getUserFromToken($requestToken)
{
    $users = getDatabase("users.json");
    
    if (!$users) {
        abort(500, "Internal Server Error (database file '$filename' does not exist)");
    }

    foreach ($users as $user) {
        if (isset($user["username"], $user["password"])) {
            $username = $user["username"];
            $password = $user["password"];

            $userToken = sha1("$username$password");

            if ($requestToken == $userToken) {
                return $user;
            }
        }
    }

    return false;
}

function removeUserLists($user)
{
    $listDatabase = getDatabase("lists.json");

    if (!$listDatabase) {
        abort(500, "Internal Server Error (database file 'lists' does not exist)");
    }

    //$userId = $user["id"];
    $username = $user;

    foreach ($listDatabase as $listIndex => $list ) { 
        if ($list["createdBy"] == $username) {
            array_splice($listDatabase, $listIndex, 1);
        }
    }

    $json = json_encode($listDatabase, JSON_PRETTY_PRINT);
    file_put_contents("lists.json", $json);
 }

function logActivity ($activity) {
    $activityDatabase = getDatabase("./activity.json");

    $activityDatabase[] = $activity;
    $json = json_encode($activityDatabase, JSON_PRETTY_PRINT);
    file_put_contents("activity.json", $json);
 }

function updateInteractionCount ($interaction) {
    $interactionDatabase = getDatabase("interaction.json");
    $action = $interaction["action"];
    
    foreach($interactionDatabase as &$movie){
        if ($movie["movieId"] == $interaction["movieId"]){
            
            if ($interaction["method"] == "POST") {
                $count = ($movie[$action] + 1);
            } else if ($interaction["method"] == "DELETE") {
                $count = ($movie[$action] - 1);
            }

            if ($action == "liked") {
                $movie["liked"] = $count;
            } else if ($action == "watched") {
                $movie["watched"] = $count;
            }

            $json = json_encode($interactionDatabase, JSON_PRETTY_PRINT);
            file_put_contents("interaction.json", $json);
            return;
        }
    }

    $movieLog = [
        "movieId" => $interaction["movieId"],
        "liked" =>  ($action == "liked") ? 1 : 0,
        "watched" =>  ($action == "watched") ? 1 : 0
    ];

    $interactionDatabase[] = $movieLog;
    $json = json_encode($interactionDatabase, JSON_PRETTY_PRINT);
    file_put_contents("interaction.json", $json);
}
?>