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
        
        // echo $query;

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

        $statement = $db->prepare("CALL delete_product(?)");

        $statement->execute([$recordId]);

        $result = $statement->fetchAll();

        $response->status = "OK";

        if ($result[0]["outcome"] != "SUCCESS") {
            $response->status = $result[0]["outcome"];
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
        $db = $dataSource->PDO();

        // $clientIP = $request->clientIP;
        $result = null;
        $get = $request->get;
        $put = $request->put;

        $newUser = $request->post;
        $ps_hash = password_hash($newUser['password'], PASSWORD_DEFAULT);

        $params = array (
            ':username' => $newUser['username'],
            ':pw_hash' => $ps_hash,
            ':first_name' => $newUser['first_name'],
            ':last_name' => $newUser['last_name'],
            ':email' => $newUser['email']
        );

        // $statement = $db->prepare('CALL update_product(:id,:title,:desc,:image,:price,:tags,:limit,:ip)');
        $statement = $db->prepare('CALL update_user(:id,:title,:desc,:image,:price,:tags,:limit)');

        $statement->execute($params);

        $result = $statement->fetchAll();

        $response->status = "OK - Remember, IP Addresses are Logged when Updating Content!";
    } catch (Exception $error) {
        $result = ["error" => $error];

        $response->status - "FAIL: ERROR";
    }

    $response->outputJSON($result);
}
function POST(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    #$perms = new Permissions(0, 0, 1);

    try {
        //$perms->verify($request->uri, $_SESSION['permissions']);
        $db = $dataSource->PDO();

        // $clientIP = $request->clientIP;

        $post = $request->post;

        // if (strpos($post['image_url'], "http") !== false)
        // {
        //     $response->status = "FAIL: ILLEGAL IMAGE URL";
        //     $response->outputJSON($post);
        // }

        // $params = array (
        //     ':title' => $post['title'],
        //     ':desc' => $post['description'],
        //     ':image' => $post['image_url'],
        //     ':price' => $post['price'],
        //     ':tags' => $post['tags'],
        //     ':limit' => $post['limit'],
        //     ':ip' => $clientIP
        // );

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
        // $statement = $db->prepare('Call post_new_product(:title,:desc,:image,:price,:tags,:limit,:ip');

        $statement->execute($params);

        $result = $statement->fetchAll();

        $response->status = "OK";
    } catch (Exception $error) {
        $msg = $error->getMessage();
        $result = ["error" => $error->GetMessage()];
        $response->status = "FAIL: $msg";
    }
    $response->outputJSON($result);
}