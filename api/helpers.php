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

<<<<<<< Updated upstream
    $newItem["id"] = createNewID($filename);
    $databaseByType[] = $newItem;
    $database[$type] = $databaseByType;

=======
    $id = 0;

    foreach ($database as $item) {
        if (isset($item["id"]) && $item["id"] > $id) {
            $id = $item["id"];
        }
    }

    $newItem["id"] = $id + 1;
    $database[] = $newItem;
>>>>>>> Stashed changes
    $json = json_encode($database, JSON_PRETTY_PRINT);
    file_put_contents($filename, $json);
    return $newItem;
}

<<<<<<< Updated upstream
function deleteItem($filename, $itemToDelete)
=======
function updateItemByType($filename, $updatedItem)
>>>>>>> Stashed changes
{
    $database = getDatabase($filename);
    
    if (!$database) {
        abort(500, "Internal Server Error (database type '$type' does not exist)");
    }

<<<<<<< Updated upstream
    $databaseByType = $database;

    foreach ($databaseByType as $index => $item) {
=======
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
>>>>>>> Stashed changes
        if (isset($item["id"]) && $item["id"] == $itemToDelete["id"]) {
            array_splice($database, $index, 1);
        }
    }

<<<<<<< Updated upstream
    $database = $databaseByType;
=======
>>>>>>> Stashed changes
    $json = json_encode($database, JSON_PRETTY_PRINT);
    file_put_contents($filename, $json);
    return $itemToDelete;
}

function getUserFromToken($requestToken)
{
<<<<<<< Updated upstream
    $database = getDatabase("users.json");
    
    if (!$database) {
        abort(500, "Internal Server Error (database type '$type' does not exist)");
    }
    $users = $database;

    foreach ($users as $user) {
        if (isset($user["username"], $user["password"])) {
            $name = $user["username"];
=======
    $users = getDatabase("users.json");
    
    if (!$users) {
        abort(500, "Internal Server Error (database file '$filename' does not exist)");
    }

    foreach ($users as $user) {
        if (isset($user["username"], $user["password"])) {
            $username = $user["username"];
>>>>>>> Stashed changes
            $password = $user["password"];

            $userToken = sha1("$username$password");

            if ($requestToken == $userToken) {
                return $user;
            }
        }
    }

    return false;
}

<<<<<<< Updated upstream
function removeUserFilmsAndLists($filename, $user)
{
    $database = getDatabase($filename);

    if (!$filename) {
        abort(500, "Internal Server Error (database type '$filename' does not exist)");
    }

    if ($filename === "lists.json") {
        $lists = $database;
        $userId = $user["id"];
        $username = $user["username"];

        foreach ($list as $listIndex => $movie) {
        // If the user created the list, remove it completely
        if ($lists["createdBy"] == $userId) {
            array_slice($games, $gameIndex, 1);
        } else {
            // Otherwise we'll see if they liked it and only remove their like
            foreach ($game["likes"] as $likeIndex => $like) { 
                // Remember that each like is represented as a user_id
                if ($userId == $like) {
                    array_slice($game["likes"], $likeIndex, 1);
                    $game[$gameIndex] = $game;
                }
            }
=======
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
>>>>>>> Stashed changes
        }
    }
    }


    

    $json = json_encode($listDatabase, JSON_PRETTY_PRINT);
    file_put_contents("lists.json", $json);
        // If the user created the list, remove it completely
    
        // } else {
            
            // Otherwise we'll see if they liked it and only remove their like
            // foreach ($game["likes"] as $likeIndex => $like) { 
            //     // Remember that each like is represented as a user_id
            //     if ($userId == $like) {
            //         array_slice($game["likes"], $likeIndex, 1);
            //         $game[$gameIndex] = $game;
            //     }
            // }
 }

<<<<<<< Updated upstream
function compareNumbers($a, $b) {
    return $a - $b;
}

function createNewID($filename) {
    $array = file_get_contents($filename);
    $arrayOfIds = [];
    
    if (count($array) === 0) {
        $newID = 1;
        return $newID;
    } else {
        foreach ($arrayOfEntity as $element) {
            $arrayOfIds[] = $element['id'];
        }
        sort($arrayOfIds);
        $newID = null;
        
        $counter = 1;
        
        foreach ($arrayOfIds as $id) {
            if ($id !== $counter) {
                $newID = $counter;
                break;
            } else {
                $counter++;
            }
        }
        
        if (!isset($newID)) {
            $newID = count($arrayOfIds) + 1;
        }
        
        return $newID;
    }
}
?>
=======
 function logActivity ($activity) {
    $activityDatabase = getDatabase("./activity.json");

    $activityDatabase[] = $activity;
    $json = json_encode($activityDatabase, JSON_PRETTY_PRINT);
    file_put_contents("activity.json", $json);
 }
?>
>>>>>>> Stashed changes
