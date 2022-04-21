import { App } from './app.js';
import { Model } from './model.js';
import { View, PartialView } from './view.js';
import { ActionManager } from './libs/action_manager.js';
import { EventData } from './libs/event_data.js';

// By exporting these classes we can easily reference them later in individual controllers. 
export { Model, View, PartialView, EventData };

/**
 * Base class for controllers. Doesn't really have to do much by itself. 
 */
export class Controller {

    constructor(viewName, modelObjectType) {
        const self = this;
        this.view = new View(viewName);
        this.model = new Model(modelObjectType);
        this.app = new App();
        this.actionManager = new ActionManager();

        // Frequently Used Actions
        this.onClick("toggleElement", (e) => {
            let eData = new EventData(e);

            let selector = eData.for ?? "";

            self.view.toggle(selector);
        });
    }

    onClick(action, callback) {
        this.actionManager.on("click", action, callback);
    }

    onKeyup(action, callback) {
        this.actionManager.on("keyup", action, callback);
    }

    onChange(action, callback) {
        this.actionManager.on("change", action, callback);
    }

    onSubmit(action, callback) {
        this.actionManager.on("submit", action, callback, true);
    }


}