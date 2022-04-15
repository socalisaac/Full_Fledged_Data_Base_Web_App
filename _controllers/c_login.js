import { Controller } from '../app/controller.js';
import { HomePage } from '../_objects/homepage.js';


const login = new Controller("home", HomePage);

(async () => {

    await login.view.downloadTemplate();
    await login.model.importData();

    login.view.render(login.model.item);

    login.onClick("test", () => {
        alert("This is a test.");
    });

})();