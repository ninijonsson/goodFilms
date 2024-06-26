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

//hämta user lists (token required)
if ($requestMethod == "GET") {
    $listDatabase = getDatabase("lists.json");
    $userDatabase = getDatabase("users.json");

    if (isset ($_GET["user"])) {

        $token = $_GET["user"];
        $userInfo = getUserFromToken($token);

        if (isset($_GET["id"])) {
            foreach ($listDatabase as $list) {
                if ($list["id"] == $_GET["id"]){
                    
                    if($userInfo["id"] == $list["createdBy"]) {
                        $list["createdBy"] = $userInfo["username"];
                        send(201, $list);
                        break;
                    }

                    foreach ($userDatabase as $user) {
                        if ($list["createdBy"] == $user["id"]) {
                            $list["createdBy"] = $user["username"];
                            send(201, $list);
                        }
                    }
                }
            }
        }

    

        foreach($userDatabase as $user) {
            if ($user["id"] == $userInfo["id"]) {
                $listIds = $user["lists"];
            }
        }

        $lists = [];
        foreach($listIds as $listId) {
            foreach($listDatabase as $list){
                if ($list["id"] == $listId) {
                    $lists[] = $list;
                }
            }
        }

        send(200, $lists);

    }

    if (isset($_GET["profile"])) {
        foreach($userDatabase as $user) {
            if ($user["id"] == $_GET["profile"]) {
                $listIds = $user["lists"];
            }
        }

        $lists = [];
        foreach($listIds as $listId) {
            foreach($listDatabase as $list){
                if ($list["id"] == $listId) {
                    $lists[] = $list;
                }
            }
        }

        send(200, $lists);
    }

    send(201, $listDatabase);
}

//skapa lista (token required)
else if ($requestMethod == "POST") {
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    if (isset($requestData["token"]) == false) {
        abort(400, "Bad Request (missing token)");
    }

    $userInfo = getUserFromToken($requestData["token"]);
    $listKeys = ["id", "movieId"];
    if (isset($requestData["id"]) and isset($requestData["movieId"])){
        $listDatabase = getDatabase("lists.json");
        for ($i = 0; $i < count($listDatabase); $i++) {
            if ($listDatabase[$i]["id"] == $requestData["id"]) {

                if (isset($requestData["backdropPath"])) {
            
                    $listDatabase[$i]["backdropPath"] = $requestData["backdropPath"];
                    
                }
                
                foreach ($listDatabase[$i]["items"] as $item) {
                    if ($item == $requestData["movieId"]){
                     abort(409, "Conflict (movie is already in list)");
                    }
                }

                $listDatabase[$i]["items"][] = $requestData["movieId"];

                $itemCount = count($listDatabase[$i]["items"]);
                $listDatabase[$i]["itemCount"] = $itemCount;

                $json = json_encode($listDatabase, JSON_PRETTY_PRINT);
                file_put_contents("lists.json", $json);
                send(201, $listDatabase[$i]);
                break;
            }
        }

        $activity = [
            "movieId" => $requestData["movieId"],
            "userId" => $userInfo["id"],
            "action" => "has added"
        ];

        logActivity($activity);
    }

    $newListKeys = ["name", "description"]; 

    if (requestContainsAllKeys($requestData, $newListKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    $extraValuesForNewList = [
        "createdBy" => $userInfo["id"],
        "favCount" => 0,
        "itemCount" => 0,
        "items" => [],
        "backdropPath" => "../../media/icons/hello_kitty.png",
    ];

    foreach ($extraValuesForNewList as $key => $value) {
        $newListKeys[] = $key;
        $requestData[$key] = $value;
    }

    $newList = insertItemByType("lists.json", $newListKeys, $requestData);
    $userDatabase = getDatabase("users.json");
    for ($i = 0; $i < count($userDatabase); $i++) {
        if ($userDatabase[$i]["username"] == $userInfo["username"]) {
            $userDatabase[$i]["lists"][] = $newList["id"];
            break;
        }
    }

 

    $json = json_encode($userDatabase, JSON_PRETTY_PRINT);
    file_put_contents("users.json", $json);
    send(201, $newList);
}

//ändra namn/description på lista
else if ($requestMethod == "PATCH")
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    $patchKeys = ["id", "token"];

    if (requestContainsAllKeys($requestData, $patchKeys) == false) {
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

    //Change "backdropPath"
    if (isset($requestData["backdropPath"])) {
        $list["backdropPath"] = $requestData["backdropPath"];
    }

    $updatedList = updateItemByType("lists.json", $list);
    send(200, $updatedList);
}

// ta bort lista (token required)
else if ($requestMethod == "DELETE")
{
    if (empty($requestData)) {
        abort(400, "Bad Request (empty request)");
    }

    if (isset($requestData["token"]) == false) {
        abort(400, "Bad Request (missing token)");
    }
    
    $user = getUserFromToken($requestData["token"]);
    $listKeys = ["id", "movieId"];
    if (isset($requestData["id"]) and isset($requestData["movieId"])){
        $listDatabase = getDatabase("lists.json");

        for ($i = 0; $i < count($listDatabase); $i++) {
            if ($listDatabase[$i]["id"] == $requestData["id"]) {
                $items = $listDatabase[$i]["items"];

                foreach ($items as $index => $item) {

                    if ($item == $requestData["movieId"]) {
                        array_splice($listDatabase[$i]["items"], $index, 1);

                        $itemCount = count($listDatabase[$i]["items"]);
                        $listDatabase[$i]["itemCount"] = $itemCount;
        
                        $json = json_encode($listDatabase, JSON_PRETTY_PRINT);
                        file_put_contents("lists.json", $json);
                        send(201);
        
                        break;
                    }

                }

            }
        }
    }

    $deleteListKeys = ["token", "id"]; 

    if (requestContainsAllKeys($requestData, $deleteListKeys) == false) {
        abort(400, "Bad Request (missing keys)");
    }

    if ($user == false) {
        abort(400, "Bad Request (invalid token)");
    }

    $list = findItemByKey("lists.json", "id", $requestData["id"]);
    
    if ($list == false) {
        abort(404, "List Not Found");
    }

    if ($user == false || $list["createdBy"] != $user["username"]) {
        abort(400, "Bad Request (invalid token)");
    }

    $deletedList = deleteItemByType("lists.json", $list);
    send(200, $deletedList);
}
else
{
    abort(405, "Method Not Allowed");
}
?>