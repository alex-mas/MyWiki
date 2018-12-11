//@ts-check
"use strict";

module.exports = (pluginHooks)=>{
    console.log("Hello world from the plugin");
    console.log('hooks:',pluginHooks);
    pluginHooks.addListener('load',(context)=>{
        console.log('plugin is being loaded', context);
        context.notify('hello','from test plugin','sentiment_very_satisfied');
        const myReducer = (state ='world', action)=>{
            if(action.type === 'pluginTestAction'){
                return action.payload;
            }else{
                return state;
            }
        }
        context.registerReducer('helloWorld', myReducer);
        const state = context.getState();
        context.notify('Reducer registered',`value is ${state.helloWorld}`,'sentiment_very_satisfied');
        console.log('the following state should contain a helloWorld property', state);
        context.dispatch({type: 'pluginTestAction', payload: 'just a regular string'});
        context.notify('Dispatched',`value is ${context.getState().helloWorld}`,'sentiment_very_satisfied');

    });
    pluginHooks.addListener('install',(InstallContext)=>{
        console.log('plugin is being installed',InstallContext);
    });
};