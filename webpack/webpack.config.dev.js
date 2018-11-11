const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const mainEntryPoint = './src/main/main.ts';
const rendererEntryPoint = './src/renderer/app.tsx';
const workerEntryFolder = './src/renderer/workers';
const workerOutputFolder = './dist/app/workers';
const outputFolder = './dist/app/';

const readdir = promisify(fs.readdir);

fs.copyFileSync('./src/static/index.html', outputFolder+'/index.html');
fs.copyFileSync('./src/static/loader.html', outputFolder+'/loader.html')


const getWorkerFiles = ()=>{
  const entryPoints = fs.readdirSync(workerEntryFolder);
  const entryObj = {};
  entryPoints.forEach((entry)=>{
    const entryName = entry.slice(0, entry.length-3);
    entryObj[entryName] = `${workerEntryFolder}/${entry}`;
  });
  return entryObj;
}

const workerConfig = {
  //entry point of application
  entry: getWorkerFiles(),
  //settings of output file, that is, path where it will be located and filename
  output: {
    path: path.join(__dirname, '..', workerOutputFolder),
    filename: '[name].js'
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
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader',
          /*{
            loader: 'typings-for-css-modules-loader',
            options: {
              //modules: true,
              namedExport: true,
              camelCase: true,
            }
          },*/
        ]
      }],


  },
  //source map options that traduce to diferent levels of hints on when exceptions occur and things like that
  devtool: 'inline-source-map',
};


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
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader',
          /*{
            loader: 'typings-for-css-modules-loader',
            options: {
              //modules: true,
              namedExport: true,
              camelCase: true,
            }
          },*/
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

module.exports = [rendererConfig, mainConfig, workerConfig];