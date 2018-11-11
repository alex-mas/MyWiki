import * as React from 'react';
import { RenderNodeProps, Editor } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton, { EditorButtonClickHandler } from '../components/editorButton';
import { Value, BlockProperties } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const UndoPlugin = (context: EditorPluginContext) => {
    const undo: EditorButtonClickHandler = () => {
        context.getEditor().undo();
    }
    return {
        id: 'undo_plugin',
        Button() {
            return (
                <EditorButton
                    onClick={undo}
                    active={false}
                    icon={'undo'}
                />
            );
        }
    };
}

export default UndoPlugin;