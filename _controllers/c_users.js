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
            window.location = "home"
        }
        else
        {
            await users.view.confirm("Deleted!");
            users.view.render(users.model.list);
        }
        
       
    } else {
        await users.view.confirm(request.status);
        users.view.render(users.model.list);
    }

});