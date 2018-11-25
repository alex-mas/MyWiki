//@ts-check
"use strict";

/**
 * @param {NodeJS.EventEmitter} pluginHooks 
 */
module.exports = (pluginHooks)=>{
    console.log("Hello world from the plugin");
    console.log('hooks:',pluginHooks);
    pluginHooks.addListener('load',(LoadContext)=>{
        console.log('plugin is being loaded', LoadContext);
    });
    pluginHooks.addListener('install',(InstallContext)=>{
        console.log('plugin is being installed',InstallContext);
    });
    pluginHooks.addListener('unload', (UnloadContext)=>{
        console.log('plugin is being unloaded',UnloadContext);
    });
    pluginHooks.addListener('uninstall',(UninstallContext)=>{
        console.log('plugin is being uninstalled',UninstallContext);
    });
};