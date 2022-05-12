<?php
session_start();

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

require("helpers/server_response.php");
require("helpers/permissions.php");


$request = new ClientRequest();
$dataSource = new DataSource();
$response = new ServerResponse($request, $dataSource);

$response->process();

$loggedInUser = $_SESSION['team_007_user'] ?? false;

if($loggedInUser == false){
    $response->status = "FAIL: Must be logged in";
    exit;
}

// Official GET request 
function GET(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
     $result = [];

    try {

        $loggedInUser = $_SESSION['team_007_user'] ?? false;

        if($loggedInUser == false){
            throw new Exception("Must be logged in to view cart");
        }
        
        $request->get['id'] = $_SESSION['team_007_user']['user_id'];

        $db = $dataSource->PDO();

        $get = $request->get;

        $query = "CALL get_cart(?)";

        $statement = $db->prepare($query);

        $param = $get['id'];

        $statement->execute([$param]);
  
        $result = $statement->fetchAll();

        $response->status = "OK";

    } catch (Exception $error) {
        $response->status = "FAIL: " . $error->getMessage();
    }

    $response->outputJSON($result);

}

// Function that processes as "DELETE" request.
function DELETE(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    $result = [];

    try {

        $db = $dataSource->PDO();

        $get = $request->get;

        $recordId = $get['id'];
        
        $result = ["not" => "changed"];

        if ($recordId == $_SESSION['team_007_user']['user_id']){
            $statement = $db->prepare("CALL empty_cart(?)");
        }
        else{
            $statement = $db->prepare("CALL delete_cart_item(?)");
        }

        $statement->execute([$recordId]);

        $result = $statement->fetchAll();

        $response->status = "OK";

        if ($result[0]["outcome"] != "SUCCESS") {
            $response->status = $result[0]["outcome"];
        }

        $response->outputJSON($result);


    } catch (Exception $error) {
        $response->status = "FAIL: " . $error->getMessage();

        $response->outputJSON($result);
    }
}

// Function that processes as "PUT" request.
function PUT(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    
}

function POST(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    $result = [];

    try {

        $db = $dataSource->PDO();
           
        $post = $request->post;

        $params = array (
            ':user_id' => $_SESSION['team_007_user']['user_id'],
            ':product_id' => $post['id']
        );

        $result = [];

        $statement = $db->prepare('Call add_to_cart(:user_id,:product_id)');

        $statement->execute($params);

        $result = $statement->fetchAll();

        $response->status = "OK";
        
    } catch (Exception $error) {
        $response->status = "FAIL: " . $error->getMessage();
    }
    $response->outputJSON($result);
}