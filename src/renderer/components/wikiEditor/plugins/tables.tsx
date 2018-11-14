import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginContext, DEFAULT_NODE } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';
import { Editor, Block } from 'slate';
import { emptyTable } from '../utilities/table';

export const TablePlugin = (context: EditorPluginContext) => {


    const renderImage = (props: RenderNodeProps, editor: Editor, next: Function) => {
        const { attributes, children, node } = props

        switch (node.type) {
            case 'table':
                return (
                    <table className='wiki-editor__table'>
                        <tbody
                            className='wiki-editor__table-body'
                            {...attributes}
                        >
                            {children}
                        </tbody>
                    </table>
                );
            case 'table-row':
                return (
                    <tr
                        className='wiki-editor__table-row'
                        {...attributes}
                    >
                        {children}
                    </tr>
                );
            case 'table-cell':
                return (
                    <td
                        className='wiki-editor__table-cell'
                        {...attributes}
                    >
                        {children}
                    </td>
                );
            default:
                return next();
        }

    }

    const onClickButton = (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault();
        const value = context.getContent();
        const editor = context.getEditor();
        const { document } = value;

        const isActive = hasBlockType(value, type);
        if (isActive) {
            editor.removeNodeByKey(value.blocks.get(-1).key);
        } else {
            editor.insertBlock('');
            editor.moveToEndOfPreviousBlock();
            editor.insertBlock(Block.fromJSON(emptyTable));
        }
    }
    return {
        id: 'tables_plugin',
        renderNode: renderImage,
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {
            return next();
            if(event.key === 'ArrowUp'){
                
            }else if (event.key === 'ArrowDown'){

            }else if(event.key === 'Enter'){

            }
        },
        Button() {
            const isActive = hasBlockType(context.getContent(), 'table');
            return (
                <EditorButton
                    onClick={onClickButton}
                    active={isActive}
                    icon={'border_all'}
                    type={'table'}
                />
            )
        }
    }
}

export default TablePlugin;