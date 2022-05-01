<?php
session_start();

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);


require("helpers/server_response.php");


$request = new ClientRequest();
$dataSource = new DataSource("helpers/mysql_credentials.json");
$response = new ServerResponse($request, $dataSource);

$response->process();

// Function that processes as "GET" request. 
function GET(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    // This trick is necessary since the json file is in a directly 1 folder up.
    $filePath = __DIR__.'/../_data/home.json';

    $result = $dataSource->JSON($filePath, false); // Use true for lists, false for singeltons. 

    $response->status = "OK";

    $response->outputJSON($result);
}

function POST(ClientRequest $request, DataSource $datasource, ServerResponse $response){

    $post = $request->post;

    $json = $post["json"];

    $output = json_decode($json, false); // Use true for lists, false for singeltons. 

    $response->status = "OK";

    // Just spit the JSON back out for now
    $response->outputJSON($output);
}