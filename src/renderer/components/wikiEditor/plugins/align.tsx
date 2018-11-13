import * as React from 'react';
import { RenderNodeProps, Plugin } from "slate-react";
import { EditorPluginContext, DEFAULT_NODE } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value, } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const generateAlignmentPlugins = (context: EditorPluginContext) => {

    const alingmentStyleValue: any = {
        right: 'flex-start',
        left: 'flex-end',
        center: 'center'
    }
    const renderAlignment = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        return (
            <div
                //@ts-ignore
                style={{ alignSelf: alingmentStyleValue[node.data.get('align')] }}
                {...attributes}
            >
                {children}
            </div>
        );
    }
    const onClickButton = (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault()
        const value = context.getContent();
        const editor = context.getEditor();
        const { document } = value;


        const isType = value.blocks.some(block => {
            //@ts-ignore
            return !!document.getClosest(block.key, parent => parent.type == type)
        });
        const isList = hasBlockType(value,'list-item');
        const isActive = hasBlockType(value,type);


        // Handle everything but list buttons.
        if (type !== 'bulleted-list' && type !== 'numbered-list') {
            if (isList) {
                editor
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {

                if (type === 'align') {
                    const isSameAlignment = value.blocks.some(block => {
                        //@ts-ignore
                        const closestBlock = document.getClosest(block.key, parent => parent.type === type);
                        //@ts-ignore

                        return closestBlock && closestBlock.data && closestBlock.data.get('align') === data.align;
                    });
                    if (isType) {
                        if (isSameAlignment) {
                            editor.unwrapBlock({
                                type,
                                data
                            });
                        } else {
                            editor
                                .unwrapBlock({
                                    type
                                })
                                .wrapBlock({
                                    type,
                                    data
                                })
                                .moveToEnd();
                        }

                    } else {
                        editor.wrapBlock({
                            type,
                            data
                        }).moveToEnd();
                    }
                }
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
    const numberToWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six']

    const alignments = ['right', 'left', 'center'];
    const alignmentPlugins = alignments.map((alignment) => {
        return {
            id: `${alignment}_alingment_plugin`,
            renderNode: RenderBlock('align', renderAlignment),
            Button() {
                let isActive;
                const value = context.getContent();
                const block = value.blocks.first();
                if (block) {
                    const parent = value.document.getParent(block.key);
                    //@ts-ignore
                    isActive = hasBlockType(value,'align') || (parent && parent.type === 'align' && parent.data.get('align') === alignment);
                }
                return (
                    <EditorButton
                        onClick={onClickButton}
                        active={isActive}
                        icon={`format_align_${alignment}`}
                        type={'align'}
                        data={{
                            align: alignment
                        }}
                    />
                );
            }
        }
    });


    return alignmentPlugins;
}

export default generateAlignmentPlugins;