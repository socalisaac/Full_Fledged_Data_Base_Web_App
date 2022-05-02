import { Controller, PartialView, EventData } from '../app/controller.js';
import { Product } from '../_objects/product.js';

const products = new Controller("products", Product);

// Initial Page Setup
(async () => {

    await products.view.downloadTemplate();
    await products.model.importData();

    let productList = products.model.list;

    products.view.render(productList);

    if(productList != "Huh?"){
        
    }
    else{
        await products.view.confirm("Something wrong");
    }

    
})();

// Add New Product Action (Create)
products.onSubmit("addNewProduct", async (e) => {
    
    let goAhead = await products.view.confirmYesNo("Are you sure?");

    if (goAhead === false) return false;

    let eData = new EventData(e);

    let newProduct = new Product(eData.formData);

    let request = await products.model.post(newProduct);

    if (request.OK) {
        alert("It Worked!");
        products.view.render(products.model.list);
    }
    else{
        await products.view.confirm(request.status);
    }
});

// View Single Product Action (Read)
products.onClick("viewProduct", async (e) => {

    let eData = new EventData(e);

    let productInfo = new Product(await products.model.get(eData.id));

    // We only need 1 PartialView at a time
    products.partial = products.partial ?? new PartialView("single-product");

    // Only download the template once
    if (!products.partial.html) await products.partial.downloadTemplate();

    let html = products.partial.build(productInfo).html;

    products.view.alert({
        html: html
    });

});

// Update Existing Product Action (Update)
products.onSubmit("updateProduct", async (e) => {

    let goAhead = await products.view.confirmYesNo("Update Product?");

    if (goAhead === false) return false;

    let eData = new EventData(e);

    let newProduct = new Product(eData.formData);

    let request = await products.model.put(newProduct);

    if (request.OK) {
        await products.view.confirm("Product Updated!");
        products.view.render(products.model.list);
    } else {
        await products.view.confirm(request.status);
    }

});

// Delete Product Action (Delete)
products.onClick("deleteProduct", async (e) => {

    let goAhead = await products.view.confirmYesNo("Are you sure?");

    if (goAhead === false) return false;

    let eData = new EventData(e);

    let targetId = eData.id;

    let request = await products.model.delete(targetId);

    if (request.OK) {
        await products.view.confirm("Deleted!");
        products.view.render(products.model.list);
    } else {
        await products.view.confirm(request.status);
    }
});
