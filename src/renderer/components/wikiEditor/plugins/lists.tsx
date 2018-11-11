import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value, Editor } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const generateListPlugins = (context: EditorPluginContext) => {

    const renderLists = (props: RenderNodeProps, editor: Editor, next: Function) => {
        const { children, node, attributes } = props;
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
                return next();
        }

    }
    const onClickButton = onClickBlockButton(context);


    const lists = ['bulleted', 'numbered'];

    const listPlugins = lists.map((list) => {
        const type = `${list}-list`;
        return {
            id: `${type}_plugin`,
            renderNode: renderLists,
            Button() {
                const isActive = hasBlockType(context.getContent(), type);
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