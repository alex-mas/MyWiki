import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginContext, DEFAULT_NODE } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';
import { remote, Dialog } from 'electron';
import * as path from 'path';
import Image from '../components/image';
import * as imageSize from 'image-size';
import ImageButton from '../components/imageButton';



const dialog: Dialog = remote.dialog;

export const ImagePlugin = (context: EditorPluginContext) => {


    const renderImage = (props: RenderNodeProps) => {
        return (
            <Image {...props} pluginContext={context} />
        );
    }


    const onClickImageButton = (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault()
        const value = context.getContent();
        const editor = context.getEditor();
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
                editor
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
                                const imagePath = filePaths[0];
                                console.log('Inserting image: ', imagePath, editor);
                                const size = imageSize(imagePath);
                                const imageRatio = size.width / size.height;

                                editor.insertBlock({
                                    type,
                                    data: {
                                        ...data,
                                        src: imagePath,
                                        height: '500',
                                        width: String(imageRatio * 500)
                                    }
                                });
                                editor.insertBlock({
                                    type: 'paragraph'
                                });

                            }
                        });
                } else {
                    const key = value.blocks.find(block => block.type === type).key;
                    if (key) {
                        editor.removeNodeByKey(key);
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

    return {
        id: 'image_plugin',
        renderNode: RenderBlock('image', renderImage),
        Button() {
            return (
                <ImageButton
                    {...context}
                />
            )
        }
    }
}

export default ImagePlugin;