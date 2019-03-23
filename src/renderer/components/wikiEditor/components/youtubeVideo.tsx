import * as React from 'react';
import { RenderNodeProps, findNode } from 'slate-react';
import Resizable, { ResizeCallback } from 're-resizable';
import { EditorPluginContext } from '../wikiEditor';
import { Block, Data } from 'slate';
import { hasBlockType } from '../utilities/blocks';


interface ComponentProps extends RenderNodeProps {
    pluginContext: EditorPluginContext
}

export class YoutubeVideo extends React.Component<ComponentProps, { width: number, height: number }>{
    constructor(props: ComponentProps) {
        super(props);
    }
    onResizeVideo: ResizeCallback = (e, direction, ref, d) => {
        const value = this.props.pluginContext.getContent();
        const editor = this.props.pluginContext.getEditor();
        debugger;
        const isActive = hasBlockType(value, 'youtube_video');
        const block = value.blocks.find(block => block.type === 'youtube_video');
        if(!block){
            return;
        }
        let key = block.key;
        if (key) {
            editor.replaceNodeByKey(key, new Block({
                data: Data.create({
                    height: String(Number(block.data.get('height')) + d.height),
                    videoId: block.data.get('videoId')
                }),
                key,
                nodes: block.nodes,
                type: 'youtube_video'
            }));
        }

    }
    render() {
        const { children, node, attributes } = this.props;
        const isResizable = !this.props.pluginContext.isReadOnly();
        const height = Number(node.data.get('height'));
        const width = height * 16/9;
        return (
            <div {...attributes}>
                <Resizable
                    size={{
                        width: width,
                        height: height
                    }}
                    maxHeight={(window.innerWidth * 0.7)*9/16}
                    onResizeStop={this.onResizeVideo}
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
                    <webview
                        style={{width: String(width)+'px', height: String(height)+'px'}}
                        src={`https://www.youtube.com/embed/${node.data.get('videoId')}`}
                        nodeintegration={false}
                        allowpopups={false}
                        allowFullScreen
                    />
                </Resizable>
            </div>
        )
    }
}


export default Image;
