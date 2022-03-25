<?php

class ClientRequest
{
    public $files;
    public $put;
    public $post;
    public $get;
    public $method;
    public $db;
    public $clientIP;
    public string $uri;

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->files = $_FILES;
        $this->post = $_POST;
        $this->get = $_GET;
        $this->uri = $_SERVER['REQUEST_URI'];

        parse_str(file_get_contents("php://input"), $this->put);

        // if we got a "json" value from POST or PUT, let's just 
        // decode it and set those values. 

        $postJson = $_POST['json'] ?? false;
        $putJson = $this->put['json'] ?? false;

        if($postJson){
            $this->post = json_decode($postJson, true);
            // keep the 'json' property for backwards compatability
            $this->post['json'] = $postJson;
        }

        if($putJson){
            $this->put = json_decode($putJson, true);
            // keep the 'json' property for backwards compatability
            $this->put['json'] = $putJson; 
        }
    }
}