import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginOptions, DEFAULT_NODE } from '../../wikiEditor';
import EditorButton from '../../components/editorButton';
import { Value } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../../utilities/blocks';



export const generateAlignmentPlugins = (options: EditorPluginOptions) => {

    const renderAlignment = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        return (
            <div
                //@ts-ignore
                style={{ textAlign: node.data.get('align') }}
                {...attributes}
            >
                {children}
            </div>
        );
    }
    const onClickButton = (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault()
        const value = options.getContent();
        const change = value.change();
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
                change
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
                            change.unwrapBlock({
                                type,
                                data
                            });
                        } else {
                            change
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
                        change.wrapBlock({
                            type,
                            data
                        }).moveToEnd();
                    }
                }
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
        options.onChange(change);
    }
    const numberToWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six']

    const alignments = ['right', 'left', 'center'];

    const alignmentPlugins = alignments.map((alignment) => {
        return {
            renderNode: RenderBlock('align', renderAlignment),
            Button() {
                let isActive;
                const value = options.getContent();
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