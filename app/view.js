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

    /**
     * Build the view HTML which can then be randered later.
     * @param {object} modelData 
     * @returns the View (for chaining) [view.build(data).inject(element, position);]
     */
    build(modelData) {
        Object.assign(modelData, window.app);
        this.html = mustache.render(this.template, modelData)
        return this;
    }

    /**
     * Render the current view HTML relative to an element using insertAdjascentHTML.
     * @param {HTMLElement, string} element Element or CSS Selector for an Element
     * @param {string} position "beforebegin", "afterbegin", "beforeend" or "afterend"
     * @returns then element used for HTML instertion
     */
    inject(element, position) {
        if (!element instanceof HTMLElement) {
            element = document.querySelector(element);
        }
        element.insertAdjascentHTML(position, this.html);
        return element
    }

    _adjustVisibility(selector, method) {
        if (selector instanceof HTMLElement){
            let fakeId = `A${Math.random().toString().slice(2)}`;
            selector.id = selector.id || fakeId;
            selector = `#${selector.id}`;
        }
        document.querySelectorAll(`${selector}`).forEach(e => {
            e.classList[method]("hidden");
        })
    }

    toggle(selector) {
        document.querySelectorAll(`${selector}`).forEach(e => {
            e.classList.toggle("hidden");
        })
    }

    show(selector) {
        document.querySelectorAll(`${selector}`).forEach(e => {
            e.classList.remove("hidden");
        })
    }

    hide(selector) {
        document.querySelectorAll(`${selector}`).forEach(e => {
            e.classList.remove("hidden");
        })
    }

    closeModal() {
        let closeAction = new Event("closeModal");
        document.body.dispatchEvent(closeAction);
    }

    // alert(data) {
    //     if (typeof data )
    // }
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