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

        if (itemsList.OK){

            itemsList.totalCost = 0;

            itemsList.items.forEach(x => itemsList.totalCost += parseFloat(x.totalPrice));
    
            itemsList.totalCost = itemsList.totalCost.toFixed(2);

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

    let itemsList = cart.model.list;

    itemsList.totalCost = 0;

    itemsList.items.forEach(x => itemsList.totalCost += parseFloat(x.totalPrice));

    itemsList.totalCost = itemsList.totalCost.toFixed(2);

    if (request.OK) {
        await cart.view.downloadTemplate();
        await cart.model.importData();
        cart.view.render(itemsList);
        await cart.view.confirm("Item has been DELETED!");
    } else {
        cart.view.render(cart.model.list);
        await cart.view.confirm(request.status);
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
        await cart.view.downloadTemplate();
        await cart.model.importData();
            
        let itemsList = cart.model.list;

        itemsList.totalCost = 0;

        itemsList.items.forEach(x => itemsList.totalCost += parseFloat(x.totalPrice));

        itemsList.totalCost = itemsList.totalCost.toFixed(2);
    
        cart.view.render(itemsList);

        await cart.view.confirm("Item(s) have been CLEARED from your cart!");
    } else {

        let itemsList = cart.model.list;

        itemsList.totalCost = 0;

        itemsList.items.forEach(x => itemsList.totalCost += parseFloat(x.totalPrice));

        itemsList.totalCost = itemsList.totalCost.toFixed(2);

        await cart.view.confirm(request.status);
        cart.view.render(itemsList);
    }
});

// Check Out (Buy Items)
cart.onClick("checkOut", async (e) => {

    let goAhead = await cart.view.confirmYesNo("Are you sure you would like to your complete order?");

    if (goAhead === false) return false;

    await cart.model.importData();

    let cartList = cart.model.list;

    // Empty Cart
    let eData = new EventData(e);

    let targetId = eData.id;

    let request = await cart.model.delete(targetId);

    if (request.OK) {
        
        await cart.view.downloadTemplate();
        await cart.model.importData();
        let itemsList = cart.model.list;

        itemsList.totalCost = 0;

        itemsList.items.forEach(x => itemsList.totalCost += parseFloat(x.totalPrice));

        itemsList.totalCost = itemsList.totalCost.toFixed(2);

        cart.view.render(itemsList);
        
        await cart.view.confirm("Thank you for shopping with us! Your cart will be emptied and you can print your receipt on the next popup window.");
    } else {

        let itemsList = cart.model.list;

        itemsList.totalCost = 0;

        itemsList.items.forEach(x => itemsList.totalCost += parseFloat(x.totalPrice));

        itemsList.totalCost = itemsList.totalCost.toFixed(2);

        await cart.view.confirm(request.status);
        cart.view.render(itemsList);
    }

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

        cart.view.alert({
            html: html
        });
    }
});