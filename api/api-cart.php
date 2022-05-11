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
    exit;
}

// Official GET request 
function GET(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    $perms = new Permissions(1, 1, 1);

    $result = [];

    try {
        
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
    // $perms = new Permissions(0, 0, 1);

    $result = [];

    try {

        // $loggedInUser = $_SESSION['team_007_user'] ?? false;

        // if($loggedInUser != false){
        //     $perms->verify($request->uri, $_SESSION['team_007_user']['permissions'], "Must be an Admin to delete an item");

        //     $db = $dataSource->PDO();
        // }
        // else{
        //     throw new Exception("Permission Denied: Must be logged in");
        // }

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
    try {
        
        $result = null;
        $put = $request->put;

        if($put['id'] != $_SESSION['team_007_user']['user_id'])
        {
            $perms = new Permissions(1, 1, 1);

            $perms->verify($request->uri, $_SESSION['team_007_user']['permissions'], "Must be admin to change other users!");
        }
            
        $db = $dataSource->PDO();

        $params = array (
            ':id' => $_SESSION['team_007_user']['user_id'],
            ':username' => $put['username'],
            ':first_name' => $put['first_name'],
            ':last_name' => $put['last_name'],
            ':email' => $put['email'],
            ':address' => $put['address'],
            ':picture' => $put['picture']
        );

        $statement = $db->prepare('CALL update_user(:id, :username, :first_name, :last_name, :email, :address, :picture)');

        $statement->execute($params);

        $result = $statement->fetchAll()[0];

        if (isset($result['error'])){
            throw new Exception($result['detail']);
        }

        if($put['id'] == $_SESSION['team_007_user']['user_id']){
            $_SESSION['team_007_user']['username'] = $result['username'];
        }

        $response->status = "OK";
    } catch (Exception $error) {
        $response->status = $error->getMessage();
    }

    $response->outputJSON($result);
}

function POST(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    // $perms = new Permissions(0, 0, 1);

    $result = [];

    try {
        // $loggedInUser = $_SESSION['team_007_user'] ?? false;

        // if($loggedInUser != false){
        //     $perms->verify($request->uri, $_SESSION['team_007_user']['permissions'], "Must be an Admin to create a new item");

        //     $db = $dataSource->PDO();
        // }
        // else{
        //     throw new Exception("Permission Denied: Must be logged in");
        // }

        $db = $dataSource->PDO();
           
        $post = $request->post;

        $params = array (
            ':user_id' => $_SESSION['team_007_user']['user_id'],
            ':product_id' => $post['id']
        );

        // ,
        //     ':title' => $post['title'],
        //     ':desc' => $post['description'],
        //     ':image' => $post['image_url'],
        //     ':price' => $post['price'],
        //     ':tags' => $post['tags'],
        //     ':limit' => $post['limit']

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