import * as React from 'react';
import { Editor, RenderNodeProps } from 'slate-react'
import { Value, Change } from 'slate'
import WikiLink from './wikiLink';

const initialValue = Value.fromJSON({
    document: {
        nodes: [
            {
                object: 'block',
                type: 'paragraph',
                nodes: [
                    {
                        object: 'text',
                        leaves: [
                            {
                                text: 'A line of text in a paragraph.',
                            },
                        ],
                    },
                ],
            },
        ],
    },
})

class WikiEditor extends React.Component<any, any> {
    state = {
        value: initialValue,
    }
    onChange = (change: Change) => {
        const value = change.value;
        this.setState(() => ({ value }));
    }
    renderNode = (props: RenderNodeProps)=>{
        //@ts-ignore
        switch(props.node.type){
            case 'link':
                return <WikiLink {...props}/>

        }
    }
    render() {
        return (
            <Editor
                value={this.state.value}
                onChange={this.onChange}
                renderNode={this.renderNode}
            />
        );
    }
}


export default WikiEditor;