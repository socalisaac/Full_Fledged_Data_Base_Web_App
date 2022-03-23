export class App {
    constructor() {
        if (window.app instanceof App) return window.app;
        window.app = this;
        this.version = 1.0;
    }
}




