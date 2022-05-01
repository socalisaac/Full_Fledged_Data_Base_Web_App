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

$loggedInUser = $_SESSION['user'] ?? false;

if($loggedInUser == false){
    exit;
}

// Official GET request 
function GET(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    $perms = new Permissions(1, 1, 1);

    $result = [];

    if(!$perms->verifyBool($request->uri, $_SESSION['user']['permissions'])){

        $request->get['id'] = $_SESSION['user']['user_id'];

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
        
        $result = ["not" => "changed"];

        $statement = $db->prepare("CALL delete_user(?)");

        $statement->execute([$recordId]);

        $result = $statement->fetchAll();

        $response->status = "OK";

        if ($result[0]["outcome"] != "SUCCESS") {
            $response->status = $result[0]["outcome"];
        }

        if($get['id'] == $_SESSION['user']['user_id']){
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

        if($put['id'] != $_SESSION['user']['user_id'])
        {
            $perms = new Permissions(1, 1, 1);

            $perms->verify($request->uri, $_SESSION['user']['permissions'], "Must be admin to change other users!");
        }
            
        $db = $dataSource->PDO();

        $params = array (
            ':id' => $put['id'],
            ':username' => $put['username'],
            ':first_name' => $put['first_name'],
            ':last_name' => $put['last_name'],
            ':email' => $put['email']
        );

        $statement = $db->prepare('CALL update_user(:id, :username, :first_name, :last_name, :email)');

        $statement->execute($params);

        $result = $statement->fetchAll()[0];

        if (isset($result['error'])){
            throw new Exception($result['detail']);
        }

        if($put['id'] == $_SESSION['user']['user_id']){
            $_SESSION['user']['username'] = $result['username'];
        }

        $response->status = "OK";
    } catch (Exception $error) {
        $response->status = $error->getMessage();
    }

    $response->outputJSON($result);
}

function POST(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    
}