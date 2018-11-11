import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginOptions, DEFAULT_NODE } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';
import { hasInlineType, wrapInline, unwrapInline } from '../utilities/inlines';
import Modal from '@axc/react-components/layout/modal';
import LinkButton from '../components/linkButton';
import WikiLink from '../components/wikiLink';
import Resizable from 're-resizable';
import { remote, Dialog } from 'electron';
import * as path from 'path';
import  Image from '../components/image';



const dialog: Dialog = remote.dialog;

export const ImagePlugin = (options: EditorPluginOptions) => {


    const renderImage = (props: RenderNodeProps) => { 
        return (
            <Image {...props} pluginOptions={options}/>
        );
    }


    const onClickImageButton = (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault()
        const value = options.getContent();
        const change = value.change();
        const { document } = value;


        const isType = value.blocks.some(block => {
            //@ts-ignore
            return !!document.getClosest(block.key, parent => parent.type == type)
        });
        const isList = hasBlockType(value, 'list-item');

        // Handle everything but list buttons.
        if (type != 'bulleted-list' && type != 'numbered-list') {
            const isActive = hasBlockType(value, type);

            if (isList) {
                change
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {
                if (!isActive) {
                    dialog.showOpenDialog(remote.getCurrentWindow(), {
                        title: 'choose image source',
                        filters: [{
                            name: 'images',
                            extensions: ['jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp', '.webp']
                        }],
                        properties: ['openFile']
                    },
                        (filePaths: string[]) => {
                            if (filePaths.length === 1) {
                                const imagePath = path.relative(__dirname, filePaths[0]);
                                console.log('Inserting image: ', imagePath, change);
                                change.insertBlock({
                                    type,
                                    data: {
                                        ...data,
                                        src: imagePath
                                    }
                                });
                                options.onChange(change);
                            }
                        });
                } else {
                    const key = value.blocks.find(block => block.type === type).key;
                    if (key) {
                        change.removeNodeByKey(key);
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

    return {
        renderNode: RenderBlock('image', renderImage),
        Button() {
            const isActive = hasBlockType(options.getContent(), 'image');
            return (
                <EditorButton
                    onClick={onClickImageButton}
                    active={isActive}
                    icon={'insert_photo'}
                    type={'image'}
                    data={{
                        height: '150',
                        width: '150',
                        src: '../../../../../../../../Media/public domain images/knight-armor-helmet-weapons-161936.jpeg'
                    }}
                />
            )
        }
    }
}

export default ImagePlugin;