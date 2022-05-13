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
cart.onClick("checkOut", async (e) => {
    let goAhead = await cart.view.confirmYesNo("Are you sure you want to check out? Your cart will be emptied!");

    if (goAhead === false) return false;

    let eData = new EventData(e);

    let targetId = eData.id;

    await cart.model.importData();

    let cartList = cart.model.list;

    // We only need 1 PartialView at a time
    cart.partial = cart.partial ?? new PartialView("receipt");

    // Only download the template once
    if (!cart.partial.html) await cart.partial.downloadTemplate();

    if (!cartList.OK) {
        await cart.view.confirm(cartList.status);

    } else {

        cartList.totalCost = 0;

        cartList.items.forEach(x => cartList.totalCost += parseFloat(x.totalPrice));

        cartList.totalCost = cartList.totalCost.toFixed(2);

        let html = cart.partial.build(cartList).html;

        await cart.view.confirm({
            html: html
        });

        cart.view.render(cart.model.list);

        let request = await cart.model.delete(targetId);

        if (request.OK) { 
            await cart.view.confirm("Thank you for Shopping With Us! Your cart will be emptied.");

            await cart.view.downloadTemplate();
            await cart.model.importData();
            let itemsList = cart.model.list;
        
            cart.view.render(itemsList);
        } else {
            await cart.view.confirm(request.status);
            cart.view.render(cart.model.list);
        }
    }
});