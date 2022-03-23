import { Controller } from '../app/controller.js';
import { Product } from '../_objects/product.js';

const products = new Controller("products", Product);


(async () => {

    await products.view.downloadTemplate();
    await products.model.importData();

    let productList = products.model.list;

    products.view.render(productList);

})();


products.onSubmit("addNewProduct", async (e) => {

    let newProduct = new Product(e.formData);

    let request = await products.model.post(newProduct);

    if(request.OK){
        alert("It Worked!");
        products.view.render(products.model.data);
    }

});

