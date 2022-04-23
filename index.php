<?php
session_start();

$user = $_SESSION['user'] ?? ["user_id" => false, "visitor" => true];
$username = $user['username'] ?? "";
$userJson = json_encode($user);

// Gets the requested page or a default value
// Prevents malicious scripting by rejecting malformed requests
$page = $_GET["page"] ?? "home";
if(!preg_match('/^[\w-]+$/', $page)){
    http_response_code(400);
    exit("EROR: 400 - Bad Request");
}
?>
<!doctype html>
<html lang="en">
<head>
    <script>
        window.app = {
            user: <?php echo ($userJson); ?>
        }
    </script>
    <title>CPSC431 Web App - MVC (<?php echo($page);?>)</title>
    <style>
        <?php include("css/app.css"); ?>
    </style>
    <link class="page-css" id="css_<?php echo($page);?>" rel="stylesheet" href="css/<?php echo($page);?>.css"/>
</head>

<body>
    <header>
        <nav>
            <a href="home" title="Home Page">Home Page</a>
            <a href="products" title="Product Listings">Products</a>
            </div class = "login-status-nav">
                <?php if ($user['user_id'] == false) { ?>
                    <a href="login" title="Login or Sign Up">Login or Sign Up</a>
                <?php } else { ?>
                    <strong> Logged in as <?php echo ($username); ?> <a href='login?logout=1'>(Log Out)</a></strong>
                <?php } ?>
            </div>
        </nav>
    </header>
    <main>
        <div id="<?php echo ("view_$page") ?>">&nbsp;</div>
    </main>
    <footer>
        <!-- This footer is on every page. Copyright info is common. -->
       <p>&copy; <?php echo date("Y"); ?> Steven Cooper, All Rights Reserved.</p>
    </footer>
    <script type="module" src='_controllers/c_<?php echo ("$page"); ?>.js'></script>
</body> 