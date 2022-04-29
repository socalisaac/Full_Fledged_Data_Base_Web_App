import { Controller, PartialView, EventData } from '../app/controller.js';
import { User } from '../_objects/user.js';

const users = new Controller("users", User);

// Initial Page Setup
(async () => {
    if(window.app.user.user_id == false){
        window.location = "login"
    }
    else
    {
        await users.view.downloadTemplate();
        await users.model.importData();
        let usersList = users.model.list;
    
        users.view.render(usersList);
    }
    
    //users.view.render({});
})();


// Add New Product Action (Create)
users.onSubmit("addNewProduct", async (e) => {


});

// View Single Product Action (Read)
users.onClick("viewProduct", async (e) => {



});

// Update Existing Product Action (Update)
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
    } else {
        await users.view.confirm(request.status);
    }

});

// Delete Product Action (Delete)
users.onClick("deleteProduct", async (e) => {


});