import { Controller, PartialView, EventData } from '../app/controller.js';
import { Product } from '../_objects/product.js';
import { Cart } from '../_objects/cart.js';
import { Result } from '../app/result.js';

const products = new Controller("products", Product);
const cart = new Controller("cart", Cart);

// Initial Page Setup
(async () => {

    await products.view.downloadTemplate();
    await products.model.importData();
    let productList = products.model.list;

    if (!productList.OK) {
        await products.view.confirm(productList.status);

        // if (productList.status.includes("MUST LOG IN")) {
        //     window.location = "login?gobackto=products";
        // }
    } else {
        products.view.render(productList);
    }
    
})();

products.onSubmit("uploadNewImage", async (e) => {

    let eData = new EventData(e);

    let formData = eData.formData;

    var input = formData.form.querySelector('input[type="file"]')
  
    var data = new FormData()
    data.append('file', input.files[0])
    data.append('user', 'team007')

    let upload = await fetch('api/image', {
        method: 'POST',
        body: data
    });

    let result = await upload.json();

    if (result.URL) {

        let newProduct = new Product(formData);

        newProduct.image_url = result.URL;

        let request = await products.model.put(newProduct);

        if (request.OK) {
            await products.view.confirm("Product Updated!");
            products.view.render(products.model.list);
        } else {
            await products.view.confirm(request.status);
        }

    }
});

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

// Add Single Product To Cart
products.onSubmit("addToCart", async (e) => {
    
    let goAhead = await products.view.confirmYesNo("Are you sure?");

    if (goAhead === false) return false;

    let eData = new EventData(e);

    let product = new Product(eData.formData);

    let request = await cart.model.post(product);

    if (request.OK) {
        await products.view.confirm("Item Added to Cart!");
    }
    else{
        await products.view.confirm(request.status);
    }
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
