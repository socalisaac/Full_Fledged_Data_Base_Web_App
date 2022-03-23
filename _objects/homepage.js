import { Item } from '../app/result.js';

/**
 * The product model class. This can extend or modify the Model class. 
 */
export class HomePage extends Item {

    constructor(data) {
        if (data instanceof HomePage) return data;
        super(data);

        this.title = null;
        this.greeting = null;

        // Reassign the values since we just deleted them above. 
        Object.assign(this, data);
    }

}