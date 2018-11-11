import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginContext, DEFAULT_NODE } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';
import { Editor } from 'slate';

export const TablePlugin = (context: EditorPluginContext) => {


    const renderImage = (props: RenderNodeProps, editor: Editor, next: Function) => {
        const { attributes, children, node } = props

        switch (node.type) {
            case 'table':
                return (
                    <table>
                        <tbody {...attributes}>{children}</tbody>
                    </table>
                );
            case 'table-row':
                return <tr {...attributes}>{children}</tr>;
            case 'table-cell':
                return <td {...attributes}>{children}</td>;
            default:
                return next();
        }

    }

    const onClickButton = onClickBlockButton(context);
    return {
        id: 'tables_plugin',
        renderNode: renderImage,
        Button() {
            const isActive = hasBlockType(context.getContent(), 'table');
            return (
                <EditorButton
                    onClick={onClickButton}
                    active={isActive}
                    icon={'table_chart'}
                    type={'table'}
                />
            )
        }
    }
}

export default TablePlugin;