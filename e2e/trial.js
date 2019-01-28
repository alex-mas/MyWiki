
const Application = require("spectron").Application;
const electron = require("electron");
const path = require("path");

const electronPath = path.join(__dirname,"..","node_modules",".bin","electron.cmd");

console.log("running");
const appPath = path.join(__dirname,"..","dist","app");

console.log(appPath);
const app = new Application({
    path: electronPath,
    args: [appPath],
    startTimeout:37000
});

console.log("app instantiated");

(()=>{
    console.log("about to start app");
    app.start().then((application)=>{
        console.log("application started");
        application.client.waitUntilWindowLoaded(10000).then(()=>{
            console.log(application.client.getTitle() === "MyWiki");
        })
    });

})();
