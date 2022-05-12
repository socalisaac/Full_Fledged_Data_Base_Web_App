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

    if(($_SESSION['team_007_user']['role'] != "admin")){

        $request->get['id'] = $_SESSION['team_007_user']['user_id'];

    }

    try {
        $db = $dataSource->PDO();

        $get = $request->get;

        $singleQuery = "CALL get_user_by_id(?)";
        $listQuery = "CALL get_user_list()";

        $query = isset($get['id']) ? $singleQuery : $listQuery;

        $statement = $db->prepare($query);

        if(isset($get['id'])){
            $param = $get['id'];
            $statement->execute([$param]);
        }else{
            $statement->execute();
        }

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
    try {  
        $db = $dataSource->PDO();

        $get = $request->get;

        $recordId = $get['id'];

        if(($_SESSION['team_007_user']['role'] != "admin") and ($_SESSION['team_007_user']['user_id'] != $recordId)){
            throw new Exception("Only ADMINS can delete user other then them selves");
        }        
        
        $result = ["not" => "changed"];

        $statement = $db->prepare("CALL delete_user(?)");

        $statement->execute([$recordId]);

        $result = $statement->fetchAll();

        $response->status = "OK";

        if ($result[0]["outcome"] != "SUCCESS") {
            $response->status = $result[0]["outcome"];
        }

        if($get['id'] == $_SESSION['team_007_user']['user_id']){
            session_destroy();
        }

        $response->outputJSON($result);


    } catch (Exception $error) {

        $result = null;

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

        if(($_SESSION['team_007_user']['role'] != "admin") and ($put['id'] != $_SESSION['team_007_user']['user_id']))
        {
            throw new Exception("Only ADMINS can update users other then them selves");
        }

        if($_SESSION['team_007_user']['role'] == "user"){
            $user_name = $_SESSION['team_007_user']['username'];
        }
        else{
            $user_name = $put['username'];
        }
            
        $db = $dataSource->PDO();

        $params = array (
            ':id' => $put['id'],
            ':username' => $user_name,
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

//POST Is being used to update a users password
function POST(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    try {
        
        $result = null;
        $put = $request->put;

        if(($_SESSION['team_007_user']['role'] != "admin") and ($put['id'] != $_SESSION['team_007_user']['user_id']))
        {
            throw new Exception("Only ADMINS can update user's passwords");
        }
        
        $ps_hash = password_hash($put['password'], PASSWORD_DEFAULT);

        $db = $dataSource->PDO();

        $params = array (
            ':id' => $put['id'],
            ':ps_hash' => $ps_hash
        );

        $statement = $db->prepare('CALL update_user_password(:id, :ps_hash)');

        $statement->execute($params);

        $result = $statement->fetchAll()[0];

        if (isset($result['error'])){
            throw new Exception($result['detail']);
        }

        $response->status = "OK";
    } catch (Exception $error) {
        $response->status = $error->getMessage();
    }

    $response->outputJSON($result);
}