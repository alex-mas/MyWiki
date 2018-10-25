import * as React from 'react';


export interface PluginAPI {

}

export const PluginContext: React.Context<PluginAPI> = React.createContext({});

export class PluginSystem extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
        };
    }
    registerHeaderIcon = ()=>{

    }
    registerWikiCategoy = ()=>{

    }
    registerWikiView = ()=>{

    }
    registerWikiAction = ()=>{

    }
    getPluginAPI = ()=>{
        return{
            registerHeaderIcon: this.registerHeaderIcon,
            
        };
    }
    render() {
        return (
            <PluginContext.Provider value={this.getPluginAPI}>
                {this.props.children}
            </PluginContext.Provider>
        )
    }
}



export const withPlugin = (Component:React.ComponentType<any>)=>{
    return(
        <PluginContext.Consumer>
            {plugins =><Component plugins={plugins}/>}
        </PluginContext.Consumer>
    )
}


export default PluginSystem;