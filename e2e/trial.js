
const Application = require("spectron").Application;
const app = new Application({
        path: './dist/win-unpacked/mywiki.exe',
        startTimeout: 50000
});


(async ()=>{
    const started = await app.start();
    console.log(app.client.getTitle() === "MyWiki");
})();
