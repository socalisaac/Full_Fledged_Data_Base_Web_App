import { Item } from '../app/result.js';

/**
 * This object represents a single product from the database. 
 * We can extend it with data not present in the database like
 * the price converted to dollars or euros. 
 */
export class User extends Item {

    constructor(data) {
        // Return the constructor object when it's used for casting
        if (data instanceof User) return data;
        // always call super() when extending a class
        super(data);

        this.role = null;
        this.username = "";
        this.password = "";
        this.email = "";
        this.first_name = "";
        this.last_name = "";
        this.address = "";
        this.picture = "";

        Object.assign(this, data);
    }

}