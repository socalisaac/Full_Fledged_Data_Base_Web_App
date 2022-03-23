import { Controller } from '../app/controller.js';
import { HomePage } from '../_objects/homepage.js';


const home = new Controller("home", HomePage);

(async () => {

    await home.view.downloadTemplate();
    await home.model.importData();

    home.view.render(home.model.item);

    home.onClick("test", () => {
        alert("This is a test.");
    });

})();

