const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const mainEntryPoint = './src/main/main.ts';
const rendererEntryPoint = './src/renderer/app.tsx';
const workerEntryFolder = './src/renderer/workers';
const workerOutputFolder = './dist/app/workers';
const outputFolder = './dist/app/';
const readdir = promisify(fs.readdir);

if(!fs.existsSync('./dist')){
  fs.mkdirSync('./dist');
}
if(!fs.existsSync(outputFolder)){
  fs.mkdirSync(outputFolder);
}
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

module.exports = (env)=>{

  const rendererConfig = {
    mode: env.NODE_ENV,
    entry: {
      index: rendererEntryPoint,
    },
    output: {
      path: path.join(__dirname, '..', outputFolder),
      filename: 'app.js'
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js" , ".jsx"]
    },
    node: {
      __dirname: false
    },
    target: 'electron-renderer',
    module: {
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
    devtool: env.NODE_ENV === 'production' ? undefined : 'inline-source-map',
  };

  const workerConfig = {
    mode: env.NODE_ENV,
    //entry point of application
    entry: getWorkerFiles(),
    //settings of output file, that is, path where it will be located and filename
    output: {
      path: path.join(__dirname, '..', workerOutputFolder),
      filename: '[name].js'
    },
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
        },        {
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
    devtool: env.NODE_ENV === 'production' ? undefined : 'inline-source-map',
  };
  
  const mainConfig = {
    mode: env.NODE_ENV,
    entry: mainEntryPoint,
    output: {
      path: path.join(__dirname, '..', outputFolder),
      filename: 'main.js'
    },
    target: 'electron-main',
    devtool: env.NODE_ENV === 'production' ? undefined : 'inline-source-map',
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    node: {
      __dirname: false
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        }
      ]
    },
  }

  return [rendererConfig, mainConfig, workerConfig];
}
