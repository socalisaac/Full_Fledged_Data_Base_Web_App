/**
 * An extension of the FormData object with some convenience features. 
 */

 export class xFormData {
    /**
     * Create form data from a <form> elementl. 
     * @param {HTMLElement} form - Should be a form element but an ID query selector works too. 
     * @returns 
     */
    constructor(form) {

        // This just makes VS Code's intellisense work better
        if (form instanceof xFormData) return form;

        // If the input is a query selector, we'll try to find the form
        if (form?.[0] == "#") form = document.querySelector(form);

        // If the input ultimately isn't an HTML <form> element, you're out of luck. 
        if (!form?.matches?.("form")) return false;

        this.form = form;

        this.formData = new FormData(form);

        this.update();
    }

    // We separate the actual guts of the code into a public function,
    // In case you want to save this formData and update it later. 
    /**
     * 
     * @param {*} form 
     * @returns 
     */
    update() {    

        const rawData = {};

        for(var item of this.formData.entries()){
            rawData[item[0]] = item[1];
        }

        Object.assign(this, rawData);
    }

    /**
     * This clones the form data object so you have a unique, separate copy. 
     * @returns A JavaScript object with form data. 
     */
    export() {
        return JSON.parse(JSON.stringify(this));
    }
}