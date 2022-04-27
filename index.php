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
<body class="d-flex flex-column min-vh-100">
    <header>

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Navbar</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                        <li class="nav-item">
                            <a class="nav-link" href="home" title="Home Page">Home Page</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="products" title="Products">Products</a>
                        </li>
                    
                        <?php if ($user['user_id'] == false) { ?>
                            </div class="login-status-nav">
                            
                                <a href="login" title="Login or Sign Up">Login or Sign Up</a>
                            </div>
                        <?php } else { ?>
                            <li class="nav-item">
                                <a class="nav-link" href="users" title="Edit Users">Users</a>
                            </li>
                            </div class="login-status-nav">
                            <strong> Logged in as <?php echo ($username); ?> <a href='login?logout=1'>(Log Out)</a></strong>
                            </div>
                        <?php } ?>
        </ul>


        </div>
        </div>
        </nav>
    </header>
    <main>
        <section class="container main-page-content">
            <div id="<?php echo ("view_$page") ?>">&nbsp;</div>
        </section>
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