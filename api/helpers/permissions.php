<?php

class Permissions
{
    public int $view_list;
    public int $view_others;
    public int $modify_others;

    function __construct(int $view_list = 0, int $view_other = 0, int $modify_others = 0)
    {
        $this->view_list = $view_list;
        $this->view_others = $view_other;
        $this->modify_others = $modify_others;
    }

    public function verifyBool(string $uri, array $perm_list = [])
    {
        $allow = false;

        foreach( $perm_list as $item => $perms){

            $route = $perms['route'];

            if(strpos($uri, $route)){
                $vl = $perms['view_list'];
                $vo = $perms['view_others'];
                $mo = $perms['modify_others'];

                if($vl < $this->view_list) continue;
                if($vo < $this->view_others) continue;
                if($mo < $this->modify_others) continue;

                $allow = true;
            }
        }

        return $allow;
    }

    public function verify(string $uri, array $perm_list = [], string $message)
    {
        $allow = false;

        foreach( $perm_list as $item => $perms){

            $route = $perms['route'];

            if(strpos($uri, $route)){
                $vl = $perms['view_list'];
                $vo = $perms['view_others'];
                $mo = $perms['modify_others'];

                if($vl < $this->view_list) continue;
                if($vo < $this->view_others) continue;
                if($mo < $this->modify_others) continue;

                $allow = true;
            }
        }

        if ($allow == true) return $allow;

        $errorMessage = "Permission Denied: " . $message;

        throw new Exception($errorMessage);
    }
}