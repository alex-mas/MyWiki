import React from "react";
import * as ReactDOM from 'react-dom';
import { AnyRecordWithTtl } from "dns";

export default (pluginHooks: any)=>{
    pluginHooks.addListener('load',(context: any)=>{
        console.log('plugin is being loaded', context);
        context.notify('hello','from test plugin','sentiment_very_satisfied');
        const myReducer = (state ='world', action: any)=>{
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
        context.notify(
            'Dispatched',
            `value is ${context.getState().helloWorld}`,
            'sentiment_very_satisfied'
        );
        context.registerView({
            path: 'testView',
            component: ()=>"Hello world"
        });
        context.registerMenuAction({
            onClick: ()=>{
                debugger;
                context.getHistory().push('/pluginView/testView');
            },
            text: "plugin1",
            icon: "face"
        });

        const editorPlugin = (context: any) => {

            const renderBlockQuote = (props: any) => {
                const { children, node, attributes } = props;
                return (
                    <blockquote {...attributes} className='wiki-block-quote'>
                        {children}
                    </blockquote>
                );
            }
            const onClickButton = ()=>{};
        
            const type = 'block quote';
            return {
                id: 'block_quote_plugin',
                renderNode: RenderBlock(type, renderBlockQuote),
                Button() {
                    const isActive = hasBlockType(context.getContent(), type);
                    return (
                        <EditorButton
                            onClick={onClickButton}
                            active={isActive}
                            icon={'format_quote'}
                            type={type}
                        />
                    );
                }
            }
        }

    });
    pluginHooks.addListener('install',(InstallContext: any)=>{
        console.log('plugin is being installed',InstallContext);
    });
};