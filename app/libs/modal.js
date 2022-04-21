export class Modal {
    constructor(renderMethod) {
        // Default button/html values
        this.data = {
            title: "Alert",
            html: "",
            ok: "OKAY",
            yes: "YES",
            no: "NO"
        };
        this.template = "";
        this.html = "";
        this._render = renderMethod;
        this.wrappers = {};

        this.close();
        this._injectCSS();

        document.addEventListener("closeModal", this._removeModal, { once: true });


        // Default templates for modal window content wrappers
        this.wrappers.generic = `
        <div class='modal-wrapper'>
            <div class='modal-content'>
            {{#title}}
                <strong>{{title}}</strong>
                <hr>
            {{/title}}
                {{{html}}}
            </div>
        </div>
        `;

        this.wrappers.ok = `
        <div class='modal-wrapper'>
            <div class='modal-content'>
            {{#title}}
                <strong>{{title}}</strong>
                <hr>
            {{/title}}
                {{{html}}}
                <hr>
                <button type='button' id='modal-ok'>{{^ok}}OK{{/ok}}{{ok}}</button>
            </div>
        </div>
        `;

        this.wrappers.yesno = `
        <div class='modal-wrapper'>
            <div class='modal-content'>
            {{#title}}
                <strong>{{title}}</strong>
                <hr>
            {{/title}}
                {{{html}}}
                <hr>
                <button type='button' id='modal-yes'>{{^yes}}YES{{/yes}}{{yes}}</button>
                <button type='button' id='modal-no'>{{^no}}NO{{/no}}{{no}}</button>
            </div>
        </div>
        `;
    }

    _injectCSS(){

        if(document.getElementById('ModalWindowDefaultCSS')) return false;

        // Default style and animation properties for modal window. 
        document.head.insertAdjacentHTML("afterbegin", `
        <style id="ModalWindowDefaultCSS">
        .modal-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: RGBA(0, 0, 0, 0.4);
            z-index: 1000;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: show 120ms ease-in-out forwards;
            opacity: 0;
        }
        @keyframes show {
            100% {
              opacity: 1;
            }
          }    
        </style>
        `);
    }

    _injectHTML() {
        let self = this;
        document.body.insertAdjacentHTML("afterbegin", this.html);
        document.querySelector(".modal-wrapper").addEventListener("click", (e) => {
            if (e.target.matches(".modal-wrapper")) {
                self.close();
            }
        });
    }

    _removeModal() {
        document.querySelectorAll(".modal-wrapper").forEach(x => x.remove());
        
    }

    close() {
        let closeAction = new Event("closeModal");
        document.dispatchEvent(closeAction);
    }

    show(data) {

        this.template = this.wrappers.generic;
        this.html = this._render(this.template, data);
        this._injectHTML();
    }

    /**
     * Display an asynchronous confirmation alert. Holds up processing until dismissed. 
     * @param {object} data data with "html" property for content ("ok" optional button value). 
     * @returns true (always returns true, use async to wait for input)
     */
    async confirm(data) {
        let self = this;
        this.template = this.wrappers.ok;
        this.html = this._render(this.template, data);
        this._injectHTML();
        return new Promise((resolve) => {
            document.querySelector("#modal-ok").addEventListener("click", (e) => {
                self.close();
                resolve(true);
                
            });
        });
    }

    /**
     * Displays an asynchronous confirmation alert with yes/no options. Holds up processing until decided.
     * @param {object} data with "html" property for content ("yes" and "no" optiononal button values)
     * @returns true or false depending on option selected by user. 
     */
    async confirmYesNo(data) {
        let self = this;
        this.template = this.wrappers.yesno;
        this.html = this._render(this.template, data);
        this._injectHTML();
        return new Promise((resolve) => {
            document.querySelector("#modal-yes").addEventListener("click", (e) => {
                self.close();
                resolve(true);
                
            });
            document.querySelector("#modal-no").addEventListener("click", (e) => {
                self.close();
                resolve(false);
                
            });
        });
    }
}