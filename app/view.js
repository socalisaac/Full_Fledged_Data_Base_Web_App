import mustache from './libs/mustache.js';

/**
 * Basic View Class
 */
export class View {

    /**
     * 
     * @param {string} name - Name of the view
     * @param {*} settings - Overrides for default fields
     * @returns 
     */
    constructor(name, settings) {

        if (name instanceof View) return name;

        this.name = name;
        this.url = `_templates/pages/${this.name}.html`
        this.template = "";
        this.selector = `#view_${name}`;

        Object.assign(this, settings);
    }

    /**
     * Download the HTML template for this view
     */
    async downloadTemplate() {
        let request = await fetch(this.url);
        let template = await request.text();
        this.template = template;
    }

    /**
     * Write the actual HTML to the web page using a template with data placeholders
     * @param {An object with our model data} modelData 
     */
    render(modelData) {

        Object.assign(modelData, window.app);

        let html = mustache.render(this.template, modelData);
        document.querySelector(this.selector).innerHTML = html;
    }

    toggle(selector) {
        document.querySelectorAll(`${selector}`).forEach(e => {
            e.classList.toggle("hidden");
        })
    }

    show(selector) {
        document.querySelectorAll(`${selector}`).forEach(e => {
            e.classList.add("hidden");
        })
    }

    hide(selector) {
        document.querySelectorAll(`${selector}`).forEach(e => {
            e.classList.remove("hidden");
        })
    }
}

/**
 * Creates a view but with a different URL/Selector
 */
export class PartialView extends View {
    /**
     * 
     * @param {string} name - Name of the partial view
     * @param {*} settings - Overrides for default fields
     */
    constructor(name, settings) {
        super(name, {
            url: `_templates/partials/${name}.html`,
            selector: `#partial_${name}`
        });
        Object.assign(this, settings);
    }
}