import { Server } from "./presentation/server";
import { envs } from "./config/plugins/envs.plugin";

// function auto-invocated to run the main function
(() => {
    main();
})();

function main() {
    Server.start();
    console.log(envs.PORT );
    console.log(envs.MAILER_EMAIL );
    console.log(envs.MAILER_SECRET_KEY );
    // console.log(envs.PROD );
}
