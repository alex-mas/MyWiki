import { Value, MarkProperties, Editor } from "slate";
import { RenderNodeProps } from "slate-react";
import { DEFAULT_NODE, EditorPluginContext } from "../wikiEditor";

export const RenderBlock = (type: string, fn: (props: RenderNodeProps) => React.ReactNode) => {
    return (props: RenderNodeProps, editor: Editor,next: Function ) => {
        if (props.node.type === type) {
            return fn(props);
        }else{
            return next();
        }
    }
}


export const hasBlockType = (content: Value, type: string) => {
    return content.blocks.some(block => block.type === type);
}

export const onClickBlockButton = (pluginContext: EditorPluginContext) => {
    return (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault();
        const value = pluginContext.getContent();
        const editor = pluginContext.getEditor();
        const { document } = value;

        const isActive = hasBlockType(value,type);

        const isType = value.blocks.some(block => {
            //@ts-ignore
            return !!document.getClosest(block.key, parent => parent.type == type)
        });
        const isList = hasBlockType(value,'list-item');

        // Handle everything but list buttons.
        if (type != 'bulleted-list' && type != 'numbered-list') {
            if (isList) {
                editor
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {
                editor.setBlocks(isActive ? DEFAULT_NODE : {
                    type,
                    data
                });

            }
        } else {
            // Handle the extra wrapping required for list buttons.
            if (isList && isType) {
                editor
                    .setBlocks(DEFAULT_NODE)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else if (isList) {
                editor
                    .unwrapBlock(
                        type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                    )
                    .wrapBlock(type)
            } else {
                editor.setBlocks('list-item').wrapBlock(type);
            }
        }
    }
}


export default {
    hasBlockType,
    RenderBlock,
    onClickBlockButton
}