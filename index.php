<?php
session_start();

$user = $_SESSION['user'] ?? ["user_id" => false, "visitor" => true];
$username = $user['username'] ?? "";
$userJson = json_encode($user);

// Gets the requested page or a default value
// Prevents malicious scripting by rejecting malformed requests
$page = $_GET["page"] ?? "home";
if (!preg_match('/^[\w-]+$/', $page)) {
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
    <title>CPSC431 Web App - MVC (<?php echo ($page); ?>)</title>
    <style>
        <?php include("css/app.css"); ?>
    </style>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link class="page-css" id="css_<?php echo ($page); ?>" rel="stylesheet" href="css/<?php echo ($page); ?>.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato&family=Roboto&family=Varela+Round&display=swap" rel="stylesheet">
</head>

<body>
    <header>
        <nav class="nav-spacing navbar navbar-expand-md navbar-dark bg-dark">
            <div class="container-fluid">
                <div class="navbar-collapse collapse w-100 order-1 order-md-0">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link active" href="#">Logo Goes here</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="home" title="Home Page">Home Page</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="products" title="Products">Products</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="users" title="Edit Users">Users</a>
                        </li>

                    </ul>
                </div>
               
            </div class="login-status-nav">
            <?php if ($user['user_id'] == false) { ?>
                    <a class="nav-link" href="login" title="Login or Sign Up">Login or Sign Up</a>
            <?php } else { ?>
                <strong> Logged in as <?php echo ($username); ?> <a class="nav-link" href='login?logout=1'>(Log Out)</a></strong>
            <?php } ?>
            </div>
            </div>
        </nav>
    </header>
    <main>
        <div id="<?php echo ("view_$page") ?>">&nbsp;</div>
    </main>
    <footer class="footer mt-auto py-3 bg-light">
        <!-- This footer is on every page. Copyright info is common. -->
        <div class="container text-center">
            <p>&copy; <?php echo date("Y"); ?> Team 7, All Rights Reserved.</p>
        </div>
    </footer>
    <script type="module" src='_controllers/c_<?php echo ("$page"); ?>.js'></script>
    <!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
</body>

</body>