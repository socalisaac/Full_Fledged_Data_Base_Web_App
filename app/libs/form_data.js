/**
 * A simple JS class for converting an HTML <form> into a JavaScript object. 
 * You can use this to convert your form input to JSON and use it as "data"
 * for the Request.js module or anything else. 
 */
 export class FormData {
    /**
     * Create form data from a <form> elementl. 
     * @param {HTMLElement} form - Should be a form element but an ID query selector works too. 
     * @returns 
     */
    constructor(form) {

        // This just makes VS Code's intellisense work better
        if (form instanceof FormData) return form;

        // If the input is a query selector, we'll try to find the form
        if (form?.[0] == "#") form = document.querySelector(form);

        // If the input ultimately isn't an HTML <form> element, you're out of luck. 
        if (!form?.matches?.("form")) return false;

        this.data = null;

        this.form = form;

        this.update(form);
    }

    // We separate the actual guts of the code into a public function,
    // In case you want to save this formData and update it later. 
    /**
     * 
     * @param {*} form 
     * @returns 
     */
    update(form) {

        form = form ?? this.form ?? "";

        // If the input is a query selector, we'll try to find the form
        if (form?.[0] == "#") form = document.querySelector(form);

        // If the input ultimately isn't an HTML <form> element, you're out of luck. 
        if (!form?.matches?.("form")) return false;

        let formData = {};
        //Standard inputs with value attributes. 
        form.querySelectorAll("input:not([type='radio']):not([type='checkbox']), select, textarea")
            .forEach((el) => {
                formData[(el.name || el.id)] = el.value;
            });

        // Complex inputs with no simple "value" element to aggregate data. 
        form.querySelectorAll("input[type='radio']:checked, input[type='checkbox']:checked")
            .forEach((el) => {
                formData[el.name] = el.value;
            });

        this.data = formData;
    }

    /**
     * This clones the form data object so you have a unique, separate copy. 
     * @returns A JavaScript object with form data. 
     */
    export() {
        let ouput = this.data ?? { data: false };
        return JSON.parse(JSON.stringify(ouput));
    }
}