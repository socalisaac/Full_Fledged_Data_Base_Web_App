import { EventData } from "./event_data.js";
/**
 * This class handles action-related events. Almost anything that is user-initiated
 * can be handled with a single event listener per event type, attached to the 
 * document as a delegate. 
 */
export class ActionManager {
    constructor() {

        // Only allow 1 instance of this class to exist
        // Prevents accidental event listener duplication 
        let MEM = window.MasterActionManager;
        if (MEM instanceof ActionManager) return MEM;
        window.MasterActionManager = this;

        this.actions = {}; // Collection of event handlers
    }

    _listenFor(type) {

        // A closure for the callback
        let self = this;

        // Use the document as an event delegate
        document.addEventListener(type, (e) => {
            // Sometimes the event target is a child of the actual action holder
            // e.g. a TD being clicked when the action is on the TR that houses it.  
            let source = e.target.dataset.action ? e.target : e.target.closest("[data-action]");
            let action = source?.dataset?.action;
            self.actions[type]?.[action]?.(e);
        });
    }

    /**
     * Private Function! Wraps the callback in a function that 
     * creates an EventData object. 
     * @param {function} callback 
     * @returns 
     */
    _wrapCallback(callback, noDefaults) {

        return function (event) {
            if (noDefaults) event.preventDefault();
            let eventData = new EventData(event);
            callback(eventData);
        };
    }

    /**
     * Add an event listener if not already present
     * @param {string} type Type of Event
     * @returns 
     */
    _register(type) {
        if (this.actions[type]) return false; // already registered
        this.actions[type] = {};
        this._listenFor(type);
    }

    /**
     * Creates a new event action that will be invoked with the given parameters. 
     * @param {string} type "click", "keydown", "keyup", "change" & "submit" by default. 
     * @param {string} name Name of the custom action
     * @param {function(EventData input)} callback Actual function to be executed. Should accept an EventData argument. 
     */
    on(type, name, callback, noDefaults) {

        this._register(type);

        this.actions[type][name] = this._wrapCallback(callback, noDefaults);
    }

    /**
     * Convenience method. Same as "on" but with preventDefault() automatically set to true. 
     * @param {string} type "click", "keydown", "keyup", "change" & "submit" by default. 
     * @param {string} name Name of the custom action
     * @param {function(EventData input)} callback Actual function to be executed. Should accept an EventData argument. 
     */
    customOn(type, name, callback) {
        this.on(type, name, callback, true);
    }
}
