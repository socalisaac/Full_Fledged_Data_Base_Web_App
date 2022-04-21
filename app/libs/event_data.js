import { FormData } from './form_data.js';
/**
 * A convenience wrapper to streamline working with event data. 
 * The default event object does a lot. With this class you can do more
 * and you can wrap your event object in this class and get
 * better intellisense help from VS Code. 
 */
export class EventData {

    /**
     * Wraps a standard HTML Event Object with useful extra properties. 
     * @param {EventObject} event Should be an actual EventObject from an event listener. 
     * @returns an event object + convenience data/methods. 
     */
    constructor(event) {

        // Allows us to cast objects as "new EventData()" for better code hinting. 
        if (event instanceof EventData) return event;

        // Default values
        this.event = new Event("click");
        this.sourceElement = document.body;
        this.forElement = document.body;
        this.forElementList = document.querySelectorAll("body");
        this.formData = new FormData();
        this.customData = event.detail;

        // Attempt to get actual values
        let eventSource = event.target;
        let forElement = eventSource.dataset.for;
        let srcData = eventSource.dataset;
        let forElementList = document.querySelectorAll(forElement);

        let formData = new FormData(eventSource);

        // Setup Event Data Object
        let eData = {
            element: eventSource,
            event: event,
            forElement: forElementList[0] ?? this.forElement,
            forElementList: forElementList ?? this.forElementList,
            formData: formData.export()
        };

        // Integrate wrapper values & dataset into Event Data Object
        Object.assign(this, eData, srcData);
    }
}