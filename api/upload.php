<?php
    require_once 'helpers.php';
    $requestMethod = $_SERVER["REQUEST_METHOD"];

    if( $requestMethod !== 'POST')
    {
        send(405, 'Invalid Method');
    }

    if( !isset( $_POST[ 'artwork_id']) || !isset( $_FILES[ 'image_upload'])) 
    {
        send(400, 'Missing Keys');
    }

    if ($_FILES["image_upload"]["size"] > 2000000) 
    { 
        send(400, "image size too large"); 
    }

    $path_parts = pathinfo($_FILES["image_upload"]["name"]);
    $ext = $path_parts["extension"];
    if (!in_array($ext, ["jpg", "png", "jpeg", 'webp']))
    { 
        send(400, "File type not allowed"); 
    }

    $id = $_POST['artwork_id'];
    $user = getUserFromToken($_POST["token"]);
    $username = $user["username"];

    $img_src = $_FILES['image_upload']['tmp_name'];

    $media_path = './media';
    $image_type = $_FILES["image_upload"]["type"];
    $ending = str_replace("image/", ".", $image_type);

    $type = $_POST['type'];
    $file_name = $_FILES['image_upload']['name'];
    $fileNameNoExt = (pathInfo($file_name))['filename'];
    $folder = $type . 's';

    $image_name = $username . '_' . $fileNameNoExt . '.' .$ext;
    $destination = "$media_path/$folder/$image_name";

    $userDatabase = getDatabase("users.json");

    foreach ($userDatabase as &$userInDatabase) {
        if ($userInDatabase["id"] == $user["id"]) {
            $userInDatabase[$type] = $destination;

            $json = json_encode($userDatabase, JSON_PRETTY_PRINT);
            file_put_contents("users.json", $json);
        }
    }

    if ( !move_uploaded_file($img_src, $destination)) 
    { 
        send(409, "failed at moving uploaded image"); 
    };

    send(200, $destination);
?>