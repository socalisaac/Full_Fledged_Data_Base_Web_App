<?php

class DataSource
{

    private $host =  null;
    private $user = null;
    private $pass = null;
    private $db = null;
    private $creds = null;

    public function __construct($credentials = null)
    {
        $this->creds = $credentials ?? "helpers/mysql_credentials.json";
    }

    // Use if your data source is JSON files
    public function JSON($path, $array = true)
    {
        $json = file_get_contents($path);
        return json_decode($json, $array); // Return PHP Object or Array
    }

    private function mysqlSetup()
    {

        $path = $this->creds;

        try {

            $json = file_get_contents($path);

            $settings = json_decode($json, true);

            $this->host = $settings['host'] ?? null;

            $this->user = $settings['username'] ?? null;

            $this->pass = $settings['password'] ?? null;

            $this->db = $settings['schema'] ?? null;
        } catch (exception $e) {

            exit($e->getMessage());
        }
    }

    // Use if your data source is MySQL and you want to use PDO
    public function PDO()
    {
        $this->mysqlSetup();

        $charset = 'utf8mb4';
        $dsn = "mysql:host=$this->host;dbname=$this->db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $pdo = new PDO($dsn, $this->user, $this->pass, $options);

        return $pdo;
    }

    // Use if your data source is MySQL and you want to use MySQLI
    function mysqli()
    {
        $this->mysqlSetup();

        $mysqli = new mysqli($this->host, $this->user, $this->pass, $this->db);

        return $mysqli;
    }
}