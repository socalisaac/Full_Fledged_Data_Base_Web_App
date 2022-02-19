<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
<header>
        <nav>
            <!-- this header is on every page, navigation is common. -->
        </nav>
    </header>
    <main>
        <div id="view_home">&nbsp;</div>
    </main>
    <footer>
        <!-- This footer is on every page. Copyright info is common. -->
        <p>&copy; 2022 Team 7, All Rights Reservedzz.</p>
    </footer>
    <script>
        // Create a new AJAX request object
        const request = new XMLHttpRequest();

        // Setup the request with a method and URL
        request.open("GET", "api/api-user.php", true);

        // Create a callback function that triggers when the request is done
        request.onload = () => {
            if (request.status >= 400){ return false;}
            let data = request.response;
            processResponse(data);
        };

        // Create a callback function that triggers if there's a network error
        request.onerror = (event) => {
            console.log("Error Occured");
            console.log(event);
        };

        // Create a function to process the request and manipulate our page
        function processResponse(data) {
            data = JSON.parse(data);
            let text = data.value ?? "NO VALUE!";
            let output = `<h1>${text}</h1>`;

            document.getElementById("view_home").innerHTML = output;
        }

        // Send the request and start the whole process!
        request.send();
    </script>
</body>
</html>