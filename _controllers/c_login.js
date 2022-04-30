import { Controller, EventData } from '../app/controller.js';
import { User } from '../_objects/user.js';
import { Login } from '../_objects/login.js';

const login = new Controller("login", Login);

(async () => {

    const urlParams = new URLSearchParams(window.location.search);
    let logoutRequest = urlParams.get('logout') ?? false;
    let loggedOut = urlParams.get('logged_out') ?? false;

    if(window.app.user.user_id != false && logoutRequest == false){
        await login.view.confirm("You are already logged in!")
        window.location = "home";
    }else{

        await login.view.downloadTemplate();

        login.view.render({});

        if (logoutRequest) {

            let result = await login.model.delete("");

            window.location = "login?logged_out=1";
        }

        if(loggedOut){
            await login.view.confirm("You Have Been Logged Out!");
        }
    }
})();

login.onSubmit("userLogin", async (e) => {

    let eData = new EventData(e);

    let userInfo = new User(eData.formData);

    let result = await login.model.put(userInfo);

    if (result.OK) {
        window.location = "home";
    } else {
        await login.view.confirm(result.status);
    }

});

login.onSubmit("userSignup", async (e) => {

    let eData = new EventData(e);

    let userInfo = new User(eData.formData);

    let status = await login.model.post(userInfo);

    if (status.OK) {
        await login.view.confirm("Success! You will now be logged in.");
        window.location = "home";
    } else {
        await login.view.confirm(status.status);
    }
});

