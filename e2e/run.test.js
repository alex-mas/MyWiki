// A simple test to verify a visible window is opened with a title
const Application = require("spectron").Application;


describe('Application launch', () => {
   let app;
   beforeAll(() => {
      app = new Application({
         path: 'node_modules/.bin/electron.cmd',
         args: ['./dist/app/main.js'],
         startTimeout: 50000
      });
      return app.start();
   },50000);

   afterAll(() => {
      if(app && app.isRunning()) { 
         return app.stop(); 
      }
   });

   test('window should be visible', async () => {
      expect.assertions(1);
      console.log(app);
      console.log(app.browserWindow);
      console.log(app.client);
      expect(app.browserWindow.isVisible()).toBe(true);
   },15000);
   test('title should be MyWiki',async ()=>{
      expect.assertions(1);
      expect(app.client.getTitle()).toEqual("MyWiki");
   },15000);
})