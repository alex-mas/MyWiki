import * as React from 'react';
import { RenderNodeProps, findNode } from 'slate-react';
import Resizable, { ResizeCallback } from 're-resizable';
import { EditorPluginContext } from '../wikiEditor';
import { Block, Data } from 'slate';


interface ComponentProps extends RenderNodeProps{
    pluginContext:EditorPluginContext
} 

export class Image extends React.Component<ComponentProps, { width: number, height: number }>{
    constructor(props: ComponentProps) {
        super(props);
    }
    onResizeImage: ResizeCallback = (e, direction, ref, d)=>{
        const value = this.props.pluginContext.getContent();
        const editor = this.props.pluginContext.getEditor();
        const block = value.blocks.find(block => block.type === 'image');
        let key = block.key;
        if(key){
            editor.replaceNodeByKey(key,new Block({
                data:Data.create({
                    width: String(Number(block.data.get('width')) + d.width),
                    height:String(Number(block.data.get('height')) + d.height),
                    src: block.data.get('src')
                }),
                key,
                nodes: block.nodes,
                type: 'image'
            }));
        }

    }
    render() {
        const { children, node, attributes } = this.props;
        const isResizable = !this.props.pluginContext.isReadOnly();
        return (
            <div {...attributes}>
                <Resizable
                    size={{
                        width: Number(node.data.get('width')),
                        height: Number(node.data.get('height'))
                    }}
                    maxWidth={window.innerWidth*0.7}
                    onResizeStop={this.onResizeImage}
                    enable={{
                        top: false,
                        right: false,
                        bottom: false,
                        left: false,
                        topRight: isResizable,
                        bottomRight: isResizable,
                        bottomLeft: isResizable,
                        topLeft: isResizable
                    }}
                
                >
                    <img
                        src={node.data.get('src')}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Resizable>

            </div>
        )
    }
}


export default Image;
