# examplePlugin

This is an example of how to develop a plugin for MyWiki

## plugin.config.json

This is a configuration file who's purpose is to let MyWiki understand what to grab and from where when the user interacts with the plugin.

Mandatory fields:

- id: unique string to identify your plugin
- name: Name of the plugin, used by MyWiki on the plugin view.
- main: The path relative to the root of the plugin folder to the entry point of the plugin. The entry point must export a function.
- version: the version of the plugin, should follow the same patterns as the version field of a npm package.
- description: Brief description of the plugin


## entry point

The entry point of the plugin must export a function, that is 
```javascript
 module.exports = function(){ 
     //your plugin code here
 }
```

Now, how does the entry point work?

Simple, 
First:
You get passed a plugin hooks object, where you can register via addListener logic to be executed when your plugin is loaded/unloaded/installed/uninstalled.

Then, this functions that you register take a context, which is an object that provide ways to interact with the app,
for instance, via this context you can register a redux reducer, display notifications, register new views, etc... 

For more detailed information about the plugin context in each lifecycle event check the documentation (TODO)


### Registering a reducer
```javascript
 module.exports = function(pluginHooks){ 
    pluginHooks.addListener('load',(context)=>{
        const myReducer = (state ='world', action)=>{
            if(action.type === 'pluginTestAction'){
                return action.payload;
            }else{
                return state;
            }
        }
        context.registerReducer('helloWorld', myReducer);
    });
 }
```

### Registering a new view

The app is made in react and expects a the component property of the view to be a react component. 

```javascript
 module.exports = function(pluginHooks){ 
    pluginHooks.addListener('load',(context)=>{
        context.registerView({
            path: 'testView',
            component: ()=>"Hello world"
        });
    });

 }
```

### Registering a menu action 

```javascript
 module.exports = function(pluginHooks){ 
    pluginHooks.addListener('load',(context)=>{
        context.registerMenuAction({
            onClick: ()=>{
                //code to execute when the menu object is clicked
            },
            //text to be displayed on the menu
            text: "plugin1",
            //icon to be displayed on the menu
            icon: "face"
        });
    });

 }
```


### Showing a notification

```javascript
 module.exports = function(pluginHooks){ 
    pluginHooks.addListener('load',(context)=>{
        context.notify(
            'Reducer registered',//Title of the notification
            `value is ${state.helloWorld}`,//Body of the notification
            'sentiment_very_satisfied' //material icon name
        );
    });

 }
```
