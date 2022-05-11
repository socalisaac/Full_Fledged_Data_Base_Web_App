import { Controller, PartialView, EventData } from '../app/controller.js';
import { Cart } from '../_objects/cart.js';

const cart = new Controller("cart", Cart);

// Initial Page Setup
(async () => {
    if(window.app.user.user_id == false){
        await cart.view.confirm("Please Login or Register to view your shopping cart!");
        window.location = "login"
    }
    else
    {
        await cart.view.downloadTemplate();
        await cart.model.importData();

        let itemsList = cart.model.list;

        if (!itemsList.OK) {
            await products.view.confirm(productList.status);
        }
        else{
            cart.view.render(itemsList);
        }
    }
})();

// Delete Item From Cart
cart.onClick("deleteItem", async (e) => {
    let goAhead = await cart.view.confirmYesNo("Are you sure?");

    if (goAhead === false) return false;

    let eData = new EventData(e);

    let targetId = eData.id;

    let request = await cart.model.delete(targetId);

    if (request.OK) { 
        await cart.view.confirm("Item has been Deleted!");
        cart.view.render(cart.model.list);
    } else {
        await cart.view.confirm(request.status);
        cart.view.render(cart.model.list);
    }
});

// Delete All Items From Cart
cart.onClick("clearCart", async (e) => {
    let goAhead = await cart.view.confirmYesNo("Are you sure?");

    if (goAhead === false) return false;

    let eData = new EventData(e);

    let targetId = eData.id;

    let request = await cart.model.delete(targetId);

    if (request.OK) { 
        await cart.view.confirm("All Items has been Cleared From Your Cart!");

        await cart.view.downloadTemplate();
        await cart.model.importData();
        let itemsList = cart.model.list;
    
        cart.view.render(itemsList);
    } else {
        await cart.view.confirm(request.status);
        cart.view.render(cart.model.list);
    }
});

// Check Out (Buy Items)
// cart.onClick("checkOut", async (e) => {
//     let goAhead = await cart.view.confirmYesNo("Are you sure?");

//     if (goAhead === false) return false;

//     let eData = new EventData(e);

//     let targetId = eData.id;

//     let request = await cart.model.delete(targetId);

//     if (request.OK) { 
//         if(eData.id == window.app.user.user_id){
//             await cart.view.confirm("Your account has been Deleted, you will be logged out now!");
//             window.location = "login?logged_out=1"
//         }
//         else
//         {
//             await cart.view.confirm("User has been Deleted!");
//             cart.view.render(cart.model.list);
//         }
        
       
//     } else {
//         await cart.view.confirm(request.status);
//         cart.view.render(cart.model.list);
//     }
// });