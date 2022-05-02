<?php
session_start();
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);


require("helpers/server_response.php");


$request = new ClientRequest();
$dataSource = new DataSource();
$response = new ServerResponse($request, $dataSource);

$response->process();

// Official GET request 
function GET(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    //$perms = new Permissions(1, 0, 0);
    $result = [];

    try {
        $db = $dataSource->PDO();
        $get = $request->get;
        $singleQuery = "CALL get_product(?)";
        $listQuery = "CALL get_product_list(?)";

        $query = isset($get['id']) ? $singleQuery : $listQuery;
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
    session_destroy();
    $response->status = "OK";
    $response->outputJSON([]);
}

// Function that processes as "PUT" request.
function PUT(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    $result = [];

    try {
        $login = ["username" => $request->put['username'], "password" => $request->put['password']];
                
        $db = $dataSource->PDO();

        $statement = $db->prepare('CALL get_user_username(?)');

        $statement->execute([$login['username']]);

        $userResult = $statement->fetchAll()[0];
        $statement->nextRowset();
        $permResult = $statement->fetchAll();

        if (isset($userResult['error'])){
            throw new Exception($userResult['error']);
        }

        $success = password_verify($login['password'], $userResult['hash']);

        if(!$success){
            throw new Exception("Invalid Password");
        }

        $userResult[$userResult['role']] = true;

        $_SESSION['team_007_user'] = $userResult;

        $_SESSION['team_007_user']['permissions'] = $permResult;

        $result = $_SESSION['team_007_user'];

        $response->status = "OK";
    } catch (Exception $error) {
        $response->status = $error->getMessage();
    }

    $response->outputJSON($result);
}

// Function that processes as "POST" request.
function POST(ClientRequest $request, DataSource $dataSource, ServerResponse $response)
{
    $result = [];

    try {

        $newUser = $request->post;
        $ps_hash = password_hash($newUser['password'], PASSWORD_DEFAULT);

        $params = array (
            ':username' => $newUser['username'],
            ':pw_hash' => $ps_hash,
            ':first_name' => $newUser['first_name'],
            ':last_name' => $newUser['last_name'],
            ':email' => $newUser['email']
        );

        $db = $dataSource->PDO();

        $statement = $db->prepare('Call post_new_user(:username,:pw_hash,:first_name,:last_name,:email)');
        // $statement = $db->prepare('Call post_new_product(:title,:desc,:image,:price,:tags,:limit,:ip');

        $statement->execute($params);

        $result = $statement->fetchAll()[0];

        if (isset($result['error'])){
            throw new Exception($result['detail']);
        }

        $request->put = [
            "username" => $result["username"],
            "password" => $newUser['password']
        ];

        $db = null;

        $statement = null;

        PUT($request, $dataSource, $response);

    } catch (Exception $error) {
       $response->status = $error->getMessage();

       $response->outputJSON($result);
    }    
}