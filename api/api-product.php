<?php
session_start();

require("helpers/server_response.php");
require("helpers/permissions.php");

$request = new ClientRequest();
$dataSource = new DataSource();
$response = new ServerResponse($request, $dataSource);

$response->process();

// Official GET request 
function GET(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    $result = [];

    try {

        $loggedInUser = $_SESSION['team_007_user'] ?? false;
        
        $db = $dataSource->PDO();
        $get = $request->get;
        $singleQuery = "CALL get_product(?)";
        $listQuery = "CALL get_product_list(?)";
        $topSixListQuery = "CALL get_product_list_top_eight(?)";

        #Permissions
        if(isset($get['id'])){
            $query = $singleQuery;
        }
        elseif($loggedInUser == false){
            $query = $topSixListQuery;
        }
        else{
            $query = $listQuery;
        }

        $param = isset($get['id']) ? $get['id'] : ($get['sort_by'] ?? "title-asc");

        $result = [];
        $statement = $db->prepare($query);
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
    $perms = new Permissions(0, 0, 1);

    $result = [];

    try {

        $loggedInUser = $_SESSION['team_007_user'] ?? false;

        if($loggedInUser != false){
            $perms->verify($request->uri, $_SESSION['team_007_user']['permissions'], "Must be an Admin to delete an item");

            $db = $dataSource->PDO();
        }
        else{
            throw new Exception("Permission Denied: Must be logged in");
        }
        $db = $dataSource->PDO();

        $get = $request->get;

        $recordId = $get['id'];
        
        $result = ["not" => "changed"];

        $statement = $db->prepare("CALL delete_product(?)");

        $statement->execute([$recordId]);

        $result = $statement->fetchAll();

        $response->status = "OK";

        if ($result[0]["outcome"] != "SUCCESS") {
            $response->status = $result[0]["outcome"];
        }

        $response->outputJSON($result);


    } catch (Exception $error) {
        $response->status = "FAIL: " . $error->getMessage();

        // $result = null;

        // $response->status = "FAIL: " . $error->getMessage();

        $response->outputJSON($result);
    }
}

// Function that processes as "PUT" request.
function PUT(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    $perms = new Permissions(0, 0, 1);

    $result = [];

    try {

        $loggedInUser = $_SESSION['team_007_user'] ?? false;

        if($loggedInUser != false){
            $perms->verify($request->uri, $_SESSION['team_007_user']['permissions'], "Must be an Admin to update an item");

            $db = $dataSource->PDO();
        }
        else{
            throw new Exception("Permission Denied: Must be logged in");
        }

        $db = $dataSource->PDO();

        // $clientIP = $request->clientIP;
        $result = null;
        $get = $request->get;
        $put = $request->put;

        $params = array(
            ':id' => $put['id'],
            ':title' => $put['title'],
            ':desc' => $put['description'],
            ':image' => $put['image_url'],
            ':price' => $put['price'],
            ':tags' => $put['tags'],
            ':limit' => $put['limit']
        );

        $statement = $db->prepare('CALL update_product(:id,:title,:desc,:image,:price,:tags,:limit)');

        $statement->execute($params);

        $result = $statement->fetchAll();

        $response->status = "OK - Remember, IP Addresses are Logged when Updating Content!";
    } catch (Exception $error) {
        $response->status = "FAIL: " . $error->getMessage();
        // $result = ["error" => $error];

        // $response->status - "FAIL: ERROR";
    }

    $response->outputJSON($result);
}
function POST(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    $perms = new Permissions(0, 0, 1);

    $result = [];

    try {
        $loggedInUser = $_SESSION['team_007_user'] ?? false;

        if($loggedInUser != false){
            $perms->verify($request->uri, $_SESSION['team_007_user']['permissions'], "Must be an Admin to create a new item");

            $db = $dataSource->PDO();
        }
        else{
            throw new Exception("Permission Denied: Must be logged in");
        }
           
        $post = $request->post;

        $params = array (
            ':title' => $post['title'],
            ':desc' => $post['description'],
            ':image' => $post['image_url'],
            ':price' => $post['price'],
            ':tags' => $post['tags'],
            ':limit' => $post['limit']
        );

        $result = [];

        $statement = $db->prepare('Call post_new_product(:title,:desc,:image,:price,:tags,:limit)');

        $statement->execute($params);

        $result = $statement->fetchAll();

        $response->status = "OK";
    } catch (Exception $error) {
        $response->status = "FAIL: " . $error->getMessage();
        // $msg = $error->getMessage();
        // $result = ["error" => $error->GetMessage()];
        // $response->status = "FAIL: $msg";
    }
    $response->outputJSON($result);
}