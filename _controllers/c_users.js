import { Controller, PartialView, EventData } from '../app/controller.js';
import { User } from '../_objects/user.js';

const users = new Controller("users", User);

// Initial Page Setup
(async () => {
    if(window.app.user.user_id == false){
        await users.view.confirm("Please Login or Register to view the user page!");
        window.location = "login"
    }
    else
    {
        await users.view.downloadTemplate();
        await users.model.importData();
        let usersList = users.model.list;
    
        users.view.render(usersList);
    }
})();

users.onSubmit("uploadNewImage", async (e) => {

    let eData = new EventData(e);

    let formData = eData.formData;

    var input = formData.form.querySelector('input[type="file"]');
  
    var data = new FormData();
    data.append('file', input.files[0]);
    data.append('user', 'team007');

    let upload = await fetch('api/image', {
        method: 'POST',
        body: data
    });

    let result = await upload.json();

    if (result.URL) {

        let newUser = new User(formData);

        newUser.picture = result.URL;

        console.log(result.URL);
        console.log("picture", newUser.picture);

        console.log(newUser);

        let request = await users.model.put(newUser);

        console.log("MADE IT!")

        if (request.OK) {
            await users.view.confirm("User Updated!");
            users.view.render(users.model.list);
            window.location = "users"
        } 
        else 
        {
            await users.view.confirm(request.status);
            users.view.render(users.model.list);
        }

    }
});

// Update Existing User Action (Update)
users.onSubmit("updateUser", async (e) => {

    let goAhead = await users.view.confirmYesNo("Update User?");

    if (goAhead === false) return false;

    let eData = new EventData(e);

    let newUser = new User(eData.formData);

    let request = await users.model.put(newUser);

    if (request.OK) {
        await users.view.confirm("User Updated!");
        users.view.render(users.model.list);
        window.location = "users"
    } 
    else 
    {
        await users.view.confirm(request.status);
        users.view.render(users.model.list);
    }

});

// Delete User Action (Delete)
users.onClick("deleteUser", async (e) => {
    let goAhead = await users.view.confirmYesNo("Are you sure?");

    if (goAhead === false) return false;

    let eData = new EventData(e);

    let targetId = eData.id;

    let request = await users.model.delete(targetId);

    if (request.OK) { 
        if(eData.id == window.app.user.user_id){
            await users.view.confirm("Your account has been Deleted, you will be logged out now!");
            window.location = "login?logged_out=1"
        }
        else
        {
            await users.view.confirm("User has been Deleted!");
            users.view.render(users.model.list);
        }
        
       
    } else {
        await users.view.confirm(request.status);
        users.view.render(users.model.list);
    }

});