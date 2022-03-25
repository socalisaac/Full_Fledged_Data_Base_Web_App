
/**
 * This module contains classes that represent results from a database operation. 
 * These could be tables, rows, views or any type of result from a stored procedure. 
 * This is your client-side version of that result. 
 * 
 * Create specific object classes that inherit from Item or ItemList to define custom
 * properties and getters that you could use in your templates. 
 */

/**
 * Result: A generic result from a data operation
 * This basically just enforces the "Status" property. 
 */
 export class Result {
    constructor(data) {
        this.status = "UNKNOWN";
        Object.assign(this, data);
    }

    get OK() {
        return this.status.includes("OK");
    }
}

/**
 * Item: A result representing a specific row from a database table.
 * This enforces an "id" property and converts a class name
 * into an "apiName" property. All classess intrinsically have a "name" 
 * property. We'll take advantage of that to use it in our API route. 
 */
export class Item extends Result {
    constructor(data) {
        if (data instanceof Item) return data;
        super(data);
        this.id = data?.id ?? null;
        this.apiName = (data.name ?? "ERROR").toLowerCase();
    }
}

/**
 * ItemList: A result with a list of items. 
 * The items are converted to a specific class type. 
 */
export class ItemList extends Result {
    constructor(data, type) {
        if (data instanceof ItemList) return data;
        super(data);
        this.items = data?.items ?? [data ?? {}];
        this.itemType = type;
        this.convertList(type);
    }

    add(item){
        this.items.push(new this.itemType(item));
    }

    remove(key, value){
        let filteredList = this.items.filter(item => {
            if (item[key] != value) return false;
        });
            
        this.items = filteredList;
    }

    replace(key, value, newItem){
        this.items.forEach((item, index)=>{
            if(item[key] == value){
                this.items[index] = newItem;
            }
        });
    }

    /**
     * Converts each item in the items list to a specific type
     * @param {Class} type A class to convert the list items to
     */
    convertList(type) {
        if (!type) return false;
        this.items.forEach((item, i) => {
            this.items[i] = new type(item);
        });
    }
}