const path = require('path');
const fs = require('fs');

const mainEntryPoint = './src/main/main.ts';
const rendererEntryPoint = './src/renderer/app.tsx';
const outputFolder = './dist/src';
const staticFolder = './dist/src/static';

if (!fs.existsSync(staticFolder)){
  fs.mkdirSync(staticFolder);
}
fs.copyFileSync('./src/static/index.html', staticFolder+'/index.html');

const rendererConfig = {
  //entry point of application
  entry: {
    index: rendererEntryPoint,
  },
  //settings of output file, that is, path where it will be located and filename
  output: {
    path: path.join(__dirname, '..', outputFolder),
    filename: 'app.js'
  },
  mode: 'development',
  //sort of modifications we can apply to files processed by webpack conditionally
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js" , ".jsx"]
  },
  node: {
    __dirname: false
  },
  target: 'electron-renderer',
  module: {
    //conditional rules
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.s?css$/,
        //When we need to use multiple loaders we can specify use property inside the rule object of rules array
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              camelCase: true
            }
          },
          'sass-loader',

        ]
      }],


  },
  //source map options that traduce to diferent levels of hints on when exceptions occur and things like that
  devtool: 'inline-source-map',
};


//NOTE: actually not needed, it adds innecesarry junk to the file, uncomment if you wish to bundle all backend code into on big file

const mainConfig = {
  entry: mainEntryPoint,
  output: {
    path: path.join(__dirname, '..', outputFolder),
    filename: 'main.js'
  },
  target: 'electron-main',
  mode: 'development',
  devtool: 'inline-source-map',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  node: {
    __dirname: false
  },
  module: {
    //conditional rules
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map'
}

//instead we bootstrap the source file into the dist folder

module.exports = [rendererConfig, mainConfig];