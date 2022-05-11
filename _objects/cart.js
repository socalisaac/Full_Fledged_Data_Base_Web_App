import { Item } from '../app/result.js';

// Represents an association between a user and a product (a link)
export class Cart extends Item {

    constructor(data) {
        // Return the constructor object when it's used for casting
        if (data instanceof Cart) return data;
        // always call super() when extending a class
        super(data);

        // Define properties and default values
        this.product_id = "";
        this.quantity = 0;

        // Overrite above properties with values provided in constructor
        Object.assign(this, data);
    }
}