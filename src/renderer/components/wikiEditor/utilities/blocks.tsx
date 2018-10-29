import { Value, MarkProperties } from "slate";
import { RenderNodeProps } from "slate-react";
import { DEFAULT_NODE } from "../wikiEditor";

export const RenderBlock = (type: string, fn: (props: RenderNodeProps) => React.ReactNode) => {
    return (props: RenderNodeProps) => {
        //@ts-ignore
        if (props.node.type === type) {
            return fn(props);
        }
    }
}


export const hasBlockType = (content: Value, type: string) => {
    return content.blocks.some(block => block.type === type);
}

export const onClickBlockButton = (getContent: () => Value, onChange: Function) => {
    return (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault();
        const value = getContent();
        const change = value.change();
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
                change
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {
                change.setBlocks(isActive ? DEFAULT_NODE : {
                    type,
                    data
                });

            }
        } else {
            // Handle the extra wrapping required for list buttons.
            if (isList && isType) {
                change
                    .setBlocks(DEFAULT_NODE)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else if (isList) {
                change
                    .unwrapBlock(
                        type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                    )
                    .wrapBlock(type)
            } else {
                change.setBlocks('list-item').wrapBlock(type);
            }
        }
        onChange(change);
    }
}


export default {
    hasBlockType,
    RenderBlock,
    onClickBlockButton
}