<?php

class Connection {

  private $host = null;
  private $user = null;
  private $pass = null;
  private $db = null;
  public mysqli $mysqli;

  public function __construct(string $db = null){

    try{

      $json = file_get_contents("helpers/mysql_credentials.json");

      $settings = json_decode($json, true);

      $this->host = $settings['host'] ?? null;

      $this->user = $settings['username'] ?? null;

      $this->pass = $settings['password'] ?? null;

      $this->db = $settings['schema'] ?? null;

      $this->mysqli = new mysqli($this->host, $this->user, $this->pass, $this->db);
    }
    catch(exception $e){

      exit($e->getMessage());

    }
    
  }

  public function getQueryResult($query) {
    return $this->mysqli->query($query);
  }
  
}


?>

