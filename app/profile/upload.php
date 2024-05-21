<?php

    require_once 'index.php';

    if( $request_method != 'POST')
    {
        send_JSON( 'Invalid Method', 405);
    }

    if( !isset( $_POST[ 'artwork_id']) || !isset( $_FILES[ 'image_upload'])) 
    {
        send_JSON( 'Missing Keys', 400);
    }

    if ($_FILES["image_upload"]["size"] > 2000000) 
    { 
        sendJSON("image size too large", 400); 
    }

    $path_parts = pathinfo($_FILES["image_upload"]["name"]);
    $ext = $path_parts["extension"];
    if (!in_array($ext, ["jpg", "png", "jpeg", 'webp']))
    { 
        sendJSON("File type not allowed", 400); 
    }

    $id = $_POST[ 'artwork_id'];

    $img_src = $_FILES[ 'image_upload']['tmp_name'];

    $media_path = './media/';
    $image_type = $_FILES["image_upload"]["type"];
    $ending = str_replace("image/", ".", $image_type);
    $image_name = $id;

    $destination = "$media_path/$image_name";

    if ( !move_uploaded_file($img_src, $destination)) 
    { 
        send_JSON("failed at moving uploaded image", 409); 
    };

    send_JSON( 'uploaded_file');

?>