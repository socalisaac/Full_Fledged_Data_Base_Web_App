<?php

$method = $_SERVER['REQUEST_METHOD'];

if (!function_exists($method)){
    header($_SERVER["SERVER_PROTOCOL"] . "405 METHOD NOT ALLOWED", true, 405);
    exit;
}

require("helpers/mysql_setup.php");
$db = new Connection();
$method($_REQUEST, $db);

function Respond($output)
{
    Header("Content-Type: application/json; charset=utf-8");
    exit(json_encode($output));
}

function GET($req, $db)
{
    $query = "CALL get_user_list";
    $result = $db->mysqli->query($query);
    $row = $result->fetch_all(MYSQLI_ASSOC);
    $output = $row[0];
    Respond($output);
}

function POST($req, $db)
{
    $output = array("method" => "POST", "status" => "200");
    Respond($output);
}

function DELETE($req, $db)
{
    $output = array("method" => "DELETE", "status" => "200");
    Respond($output);
}
?>