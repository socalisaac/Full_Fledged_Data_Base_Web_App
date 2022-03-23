import { App } from './app.js';
import { Model } from './model.js';
import { View } from './view.js';

// By exporting these classes we can easily reference them later in individual controllers. 
export { Model, View };

/**
 * Base class for controllers. Doesn't really have to do much by itself. 
 */
export class Controller {

    constructor(viewName, modelObjectType) {

        this.view = new View(viewName);
        this.model = new Model(modelObjectType);
        this.app = new App();
    }

    _formData(form) {
        let formData = {};
        //Standard inputs with value attributes. 
        form.querySelectorAll("input:not([type='radio']):not([type='checkbox']), select, textarea")
            .forEach((el) => {
                formData[el.id] = el.value;
            });

        // Complex inputs with no simple "value" element to aggregate data. 
        form.querySelectorAll("input[type='radio']:checked, input[type='checkbox']:checked")
            .forEach((el) => {
                formData[el.name] = el.value;
            });
        return formData;
    }

    _wrap(callback) {
        let self = this;

        return function (e) {
            let betterEventObject = {
                event: e,
                source: e.target,
                data: e.target.dataset,
                formData: null
            };

            // Get form data if the event source is a form.
            if (betterEventObject.source.matches("form")) {
                e.preventDefault();
                e.stopPropagation();
                let form = betterEventObject.source;

                betterEventObject.formData = self._formData(form);
            }
            callback(betterEventObject);
        };
    }

    _listenFor(eventName, action, callback) {
        let self = this;
        document.addEventListener(eventName, function (e) {
            if (e.target.dataset.action !== action) return false;
            self._wrap(callback)(e);
        });
    }

    onClick(action, callback) {
        this._listenFor("click", action, callback);
    }

    onKeyup(action, callback) {
        this._listenFor("keyup", action, callback);
    }

    onChange(action, callback) {
        this._listenFor("change", action, callback);
    }

    onSubmit(action, callback) {
        this._listenFor("submit", action, callback);
    }


}