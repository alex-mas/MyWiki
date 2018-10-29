import * as React from 'react';
import { RenderNodeProps, findNode } from 'slate-react';
import Resizable, { ResizeCallback } from 're-resizable';
import { EditorPluginOptions } from '../wikiEditor';
import { Block, Data } from 'slate';


export interface ImageProps extends RenderNodeProps{
    pluginOptions:EditorPluginOptions
}

export class Image extends React.Component<ImageProps, { width: number, height: number }>{
    constructor(props: ImageProps) {
        super(props);
    }
    onResizeImage: ResizeCallback = (e, direction, ref, d)=>{
        debugger;
        const value = this.props.pluginOptions.getContent();
        const { document } = value;
        const block = value.blocks.find(block => block.type === 'image');
        console.log('Image block: ', block);
        let key = block.key;
        if(key){
            const change = value.change();
            change.replaceNodeByKey(key,new Block({
                data:Data.create({
                    width: String(Number(block.data.get('width')) + d.width),
                    height:String(Number(block.data.get('height')) + d.height),
                    src: block.data.get('src')
                }),
                key,
                nodes: block.nodes,
                type: 'image'
            }));
            this.props.pluginOptions.onChange(change);
        }

    }
    render() {
        const { children, node, attributes } = this.props;
        const isResizable = !this.props.pluginOptions.isReadOnly();
        console.log('Rendering image, props: ', this.props);
        return (
            <div {...attributes}>
                <Resizable
                    size={{
                        //@ts-ignore
                        width: Number(node.data.get('width')),
                        //@ts-ignore
                        height: Number(node.data.get('height'))
                    }}
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
                    lockAspectRatio={true}
                >
                    <img
                        //@ts-ignore
                        src={node.data.get('src')}
                        //@ts-ignore
                        style={{ width: '100%', height: '100%' }}
                    //style={{ width: node.data.get('width'), height: node.data.get('height') }}
                    />
                </Resizable>

            </div>
        )
    }
}


export default Image;
