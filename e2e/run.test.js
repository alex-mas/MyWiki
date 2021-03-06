// A simple test to verify a visible window is opened with a title
const Application = require("spectron").Application;
const path = require("path");

var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
if (process.platform === 'win32') electronPath += '.cmd';

var appPath = path.join(__dirname, '..','dist', 'app', 'main.js');

console.log(electronPath);
console.log(appPath);

describe('Application launch', () => {
   let app;
   beforeAll(() => {
      app = new Application({
         path: electronPath,
         args: [appPath],
         startTimeout:20000
       });
      return app.start()
   },25000);

   afterAll(() => {
      if(app && app.isRunning()) { 
         return app.stop(); 
      }
   });

   test('window should be visible', async () => {
      expect.assertions(1);
      expect(await app.browserWindow.isVisible()).toBe(true);
   },2500);
   test('title should be MyWiki',async ()=>{
      expect.assertions(1);
      expect(await app.client.getTitle()).toContain("MyWiki");
   },2500);
})