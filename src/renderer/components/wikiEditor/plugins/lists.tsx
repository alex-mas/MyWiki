import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginOptions } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const generateListPlugins = (options: EditorPluginOptions) => {

    const renderLists = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        //@ts-ignore;
        switch (node.type) {
            case 'bulleted-list':
                return <ul {...attributes} className='wiki-bulleted-list'>
                    {children}
                </ul>
            case 'list-item':
                return <li {...attributes} className='wiki-list-item'>{children}</li>
            case 'numbered-list':
                return <ol {...attributes} className='wiki-numbered-list'>{children}</ol>
            default:
                return undefined;
        }
    }
    const onClickButton = onClickBlockButton(options.getContent, options.onChange);


    const lists = ['bulleted', 'numbered'];

    const listPlugins = lists.map((list) => {
        const type = `${list}-list`;
        return {
            renderNode: renderLists,
            Button() {
                const isActive = hasBlockType(options.getContent(), type);
                return (
                    <EditorButton
                        onClick={onClickButton}
                        active={isActive}
                        icon={`format_list_${list}`}
                        type={type}
                    />
                );
            }
        }
    });
    return listPlugins;
}

export default generateListPlugins;