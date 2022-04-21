export class App {
    constructor() {
        if (window.app instanceof App) return window.app;
        window.app = window.app ?? {};
        let appData = JSON.parse(JSON.stringify(window.app));
        window.app = this;
        this.version = 1.0;
        Object.assign(this, appData)
    }
}




