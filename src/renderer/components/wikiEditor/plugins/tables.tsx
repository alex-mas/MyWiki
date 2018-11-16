import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginContext, DEFAULT_NODE } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';
import { Editor, Block, Path, Node, Inline, Text } from 'slate';
import { emptyTable } from '../utilities/table';

export const TablePlugin = (context: EditorPluginContext) => {


    const renderImage = (props: RenderNodeProps, editor: Editor, next: Function) => {
        const { attributes, children, node } = props

        switch (node.type) {
            case 'table':
                return (
                    <table {...attributes} className='wiki-editor__table'>
                        <tbody
                            className='wiki-editor__table-body'
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

        const isTable = hasBlockType(value, 'table-cell');
        const block = value.blocks.get(0);
        if (isTable) {
            //@ts-ignore
            const table = document.getClosest(block.key, parent => parent.type == 'table');
            editor.removeNodeByKey(table.key);
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
            if (
                (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Enter')
                ||
                !hasBlockType(editor.value, 'table-cell')
            ) {
                return next();
            }
            //We only get here if event is one of those 3 and the selected element is a table cell
            const isTable = true;
            const tableCell = editor.value.blocks.get(0);
            //@ts-ignore
            const table: Block = editor.value.document.getClosest(tableCell.key, parent => parent.type == 'table');
            //@ts-ignore
            const tableRow: Block = editor.value.document.getClosest(tableCell.key, parent => parent.type == 'table-row');
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                //@ts-ignore;
                const previousRow: Block = table.getPreviousNode(tableRow.key);
                if (previousRow) {
                    const column = tableRow.getBlocks().findIndex(block => block.key === tableCell.key);
                    const target = previousRow.getBlocks().get(column);
                    const offset = editor.value.selection.anchor.offset;
                    editor.moveTo(target.getLastText().key, offset);
                } else {
                    const previous = editor.value.document.getPreviousNode(table.key);
                    editor.moveTo(previous.key);
                }
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                //@ts-ignore;
                const nextRow: Block = table.getNextNode(tableRow.key);
                if (nextRow) {
                    const column = tableRow.getBlocks().findIndex(block => block.key === tableCell.key);
                    const target = nextRow.getBlocks().get(column);
                    const offset = editor.value.selection.anchor.offset;
                    editor.moveTo(target.getFirstText().key, offset);
                } else {
                    const next = editor.value.document.getNextNode(table.key);
                    editor.moveTo(next.key);
                }

            } else if (event.key === 'Enter') {
                event.preventDefault();
                editor.insertText('\n');
            }
        },
        Button() {
            const value = context.getContent();
            const isActive = hasBlockType(value, 'table') || hasBlockType(value, 'table-row') || hasBlockType(value, 'table-cell');
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