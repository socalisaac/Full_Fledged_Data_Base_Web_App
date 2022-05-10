import { Item } from '../app/result.js';

/**
 * This object represents a single product from the database. 
 * We can extend it with data not present in the database like
 * the price converted to dollars or euros. 
 */
export class Product extends Item {

    constructor(data) {
        // Return the constructor object when it's used for casting
        if (data instanceof Product) return data;
        // always call super() when extending a class
        super(data);

        // Define properties and default values
        this.title = "";
        this.description = "";
        this.price = 0.00;
        this.image_url = "";

        // Overrite above properties with values provided in constructor
        Object.assign(this, data);
    }

    // A custom property that adds a unit
    get dollarPrice() {
        return `&dollar;${this.price}`;
    }

    // A custom property that calculates a different price and unit
    get euroPrice() {
        let euroPrice = (this.price * 0.9).toFixed(2);
        return `&euro;${euroPrice}`;
    }

    get full_image_url() {
        let URL = this.image_url ?? "";
        if (URL[0] == "a") {
            URL = `http://software.stevenleoncooper.com/CPSC431/007/${URL}`;
        }
        return URL;
    }
}
