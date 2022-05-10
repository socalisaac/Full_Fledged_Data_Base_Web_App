<?php

$target_dir = __DIR__ . '/../assets/uploads/';

$target_file = $target_dir . basename($_FILES["file"]["name"]);

$uploadOk = 1;

$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

$log = [];

$output = [];

$log[] = "target: " . $target_dir;

$log[] = "file: " . $target_file;

// Check if image file is a actual image or fake image
if (isset($_POST["submit"])) {
    $check = getimagesize($_FILES["file"]["tmp_name"]);
    if ($check !== false) {
        $log[] =  "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        $log[] = "File is not an image.";
        $uploadOk = 0;
    }
}

// Check if file already exists
if (file_exists($target_file)) {
    $output["URL"] = "assets/uploads/" . $_FILES["file"]["name"];
    $uploadOk = 500;
}

// Check file size
if ($_FILES["file"]["size"] > 500000) {
    $log[] = "Sorry, your file is too large.";
    $uploadOk = 0;
}

// Allow certain file formats
if (
    $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif"
) {
    $log[] = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    $log[] = "Sorry, your file was not uploaded.";
    // if everything is ok, try to upload file
} 
else if($uploadOk == 500){
    $log[] = "The file " . htmlspecialchars(basename($_FILES["file"]["name"])) . " file already exists, setting image to it.";
}
else {
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
        $output["URL"] = "assets/uploads/" . $_FILES["file"]["name"];
        $log[] = "The file " . htmlspecialchars(basename($_FILES["file"]["name"])) . " has been uploaded.";
    } else {
        $log[] = "Not uploaded because of error #" . $_FILES["file"]["error"];
    }
}

$output["log"] = $log;

exit(json_encode($output));
