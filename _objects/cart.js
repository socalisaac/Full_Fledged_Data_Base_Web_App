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
        this.price = 0;

        // Overrite above properties with values provided in constructor
        Object.assign(this, data);
    }

    get _price(){
        return parseFloat(this.price);
    }

    set _price(value){
        this.price = parseFLoat(value);
    }

    get totalPrice(){
        return (this._price).toFixed(2);
    }
}