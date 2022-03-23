import { Item, ItemList, Result } from './result.js';

const Settings = {
    apiUrl: function (apiName) {
        return `api/${apiName}`;
    }
};

/**
 * The model is a data manager that focuses on a specific type of 
 * database result. It uses one of the classes from the _objects folder
 * to determine the API URL and what class to convert the data to. 
 */
export class Model {

    /**
     * 
     * @param {Class} itemType The class this model represents, should extend Item. 
     * @returns 
     */
    constructor(itemType) {

        if (itemType instanceof Model) return itemType;

        let item = new Item(itemType);
        this.dataUrl = Settings.apiUrl(item.apiName);
        this.data = null;
        this.itemType = itemType;
        this.items = new ItemList();
    }

    /**
     * Returns the ItemList with it's "items" array. 
     */
    get list() {
        return new ItemList(this.data, this.itemType);
    }

    /**
     * Returns only the first item in our ItemList.items Array. 
     * Used when there is only 1 item anyway. 
     */
    get item() {
        let list = new ItemList(this.data, this.itemType);
        return list.items[0];
        // return new this.itemType(this.data);
    }

    /**
     * Gets data and assigns it to internal data property. 
     */
    async importData() {
        let result = await this.get();
        this.data = result;
    }

    /**
     * Internal Data Functions
     * 
     * These functions only affect the data object stored on the client. 
     * These replicate whatever action was taken on the server so that
     * the local copy of the data is the same without re-downloading it all. 
     */

    _create(data) {
        let dataList = new ItemList(this.data, this.itemType);
        dataList.add(data);
        this.data = dataList;
    }

    _read(data) {
        this.data = new ItemList(data);
    }

    _update(data) {
        let dataList = new ItemList(this.data, this.itemType);
        dataList.replace("id", data.id, data);
        this.data = dataList;
    }

    _delete(data) {
        let dataList = new ItemList(this.data, this.itemType);
        dataList.remove("id", data.id);
        this.data = dataList;
    }

    /**
     * API Functions
     * These functions communicate with the API to send/receive data. 
     * The private methods (with an _underscore) help encode data to send to the API. 
     */

    _encode(data) {
        if (!data) return "";
        return Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');
    }

    _dataString(data) {
        let jsonData = JSON.stringify(data); // convert data to JSON
        return this._encode({ json: jsonData });
    }

    async _requestJson(options, id) {
        let targetUrl = this.dataUrl + (id ? `/${id}` : "");
        let request = await fetch(targetUrl, options);
        return await request.json();
    }

    async get(id) {
        let response = await this._requestJson(null, id);
        let result = new Result(response);

        if (result.OK) {
            this.data = new ItemList(response);
        }
        
        return result;
    }

    async post(data) {

        let response = await this._requestJson({
            method: "POST",
            headers: { "content-Type": "application/x-www-form-urlencoded" },
            body: this._dataString(data)
        });

        let result = new Result(response);

        if(result.OK){
            this._create(response);
        }
        return result;
    }

    async put(data) {

        let response = await this._requestJson({
            method: "PUT",
            headers: { "content-Type": "application/x-www-form-urlencoded" },
            body: this._dataString(data)
        })

        let result = new Result(response);

        if(result.OK){
            this._update(response);
        }

        return result;
    }

    async delete(id) {

        let response = await this._requestJson({ method: "DELETE" }, id);
        let result = new Result(response);
        if(result.OK){
            this._delete(response);
        }
        return result;
    }

}