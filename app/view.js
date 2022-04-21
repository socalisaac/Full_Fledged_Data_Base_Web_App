import mustache from './libs/mustache.js';
import { Modal } from './libs/modal.js';

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
        this.html = "";

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
     * Build and render the entire view with some data. 
     * @param {object} modelData 
     */
    render(modelData) {
        this.build(modelData);
        document.querySelector(this.selector).innerHTML = this.html;
    }
    /**
     * Build the view HTML which can then be rendered later. 
     * @param {object} modelData 
     * @returns the View (for chaining) [view.build(data).inject(element, position);]
     */
    build(modelData) {
        Object.assign(modelData, window.app);
        this.html = mustache.render(this.template, modelData);
        return this;
    }

    /**
     * Render the current view HTML relative to an element using insertAdjascentHTML. 
     * @param {HTMLElement, string} element Element or CSS Selector for an Element
     * @param {string} position "beforebegin", "afterbegin", "beforeend" or "afterend"
     * @returns the element used for HTML insertion
     */
    inject(element, position) {
        if (!element instanceof HTMLElement) {
            element = document.querySelector(element);
        }
        element.insertAdjascentHTML(position, this.html);
        return element;
    }


    _adjustVisibility(selector, method) {
        if (selector instanceof HTMLElement) {
            let fakeId = `A${Math.random().toString().slice(2)}`;
            selector.id = selector.id || fakeId;
            selector = `#${selector.id}`;
        }
        document.querySelectorAll(`${selector}`).forEach(e => {
            e.classList[method]("hidden");
        })
    }

    toggle(selector) {
        this._adjustVisibility(selector, "toggle");
    }

    show(selector) {
        this._adjustVisibility(selector, "remove");
    }

    hide(selector) {
        this._adjustVisibility(selector, "add");
    }

    closeModal() {
        let closeAction = new Event("closeModal");
        document.body.dispatchEvent(closeAction);
    }

    alert(data) {
        if (typeof data === 'string') {
            data = {
                html: `<p>${data}</p>`
            };
        }
        let modalWindow = new Modal(mustache.render);
        modalWindow.show(data);
        return true;
    }

    async confirm(data) {
        if (typeof data === 'string') {
            data = {
                html: `<p>${data}</p>`
            };
        }
        let modalWindow = new Modal(mustache.render);
        return modalWindow.confirm(data);
    }

    async confirmYesNo(data) {
        if (typeof data === 'string') {
            data = {
                html: `<p>${data}</p>`
            };
        }
        let modalWindow = new Modal(mustache.render);
        return modalWindow.confirmYesNo(data);
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
