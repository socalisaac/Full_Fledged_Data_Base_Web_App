<?php

require("helpers/client_request.php");
require("helpers/data_source.php");

class ServerResponse
{
    public $status = "DEFAULT";

    public $method = null;

    public ClientRequest $request;

    public DataSource $dataSource;

    private array $items = [];

    public function __construct(ClientRequest $request, DataSource $dataSource)
    {
        $this->method = $request->method;
        $this->request = $request;
        $this->dataSource = $dataSource;
    }

    public function data($data)
    {
        $this->data = $data;

        if (is_array($data)) {
            $this->items = $data;
        } else {
            $this->items = [$data];
        }
    }

    private function build()
    {
        // Returns an object with an "items" array for multiple items
        // Or a singleton object if there's only 1 item
        $output = array();
        if (count($this->items) > 1) {
            $output['items'] = $this->items;
        }
        if (count($this->items) == 1) {
            $output = $this->items[0]; // Output converted from Array to Object
        }
        if(is_array($output)){
            $output['status'] = $this->status;
        }

        if(is_object($output)){
            $output->status = $this->status;
        }

        return $output;
    }

    public function HttpResponseCode(int $number, string $message, string $detail = "")
    {
        header($_SERVER["SERVER_PROTOCOL"] . " " . $message, true, $number);
        exit($detail);
    }

    public function outputJSON($data = null)
    {
        if ($data) $this->data($data);
        Header("Content-Type: application/json; charset=utf-8");
        exit(json_encode($this->build()));
    }

    public function process()
    {
        if (!function_exists($this->method)) {
            header($_SERVER["SERVER_PROTOCOL"] . " 405 Method Not Allowed", true, 405);
            exit;
        }

        // Because "method" is a class property, we can't execute it like a function. 
        // Instead we pass it as an argument so we can execute it lik ea function in the "exec" function. 
        $this->exec($this->method, $this->request, $this->dataSource, $this);

    }

    private function exec($method, ClientRequest $request, DataSource $dataSource, ServerResponse $response)
    {
        $method($request, $dataSource, $response);
    }
}