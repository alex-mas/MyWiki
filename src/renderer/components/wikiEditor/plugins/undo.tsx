import * as React from 'react';
import { RenderNodeProps, Editor } from "slate-react";
import { EditorPluginOptions } from '../wikiEditor';
import EditorButton, { EditorButtonClickHandler } from '../components/editorButton';
import { Value, BlockProperties } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const UndoPlugin = (options: EditorPluginOptions) => {
    const undo: EditorButtonClickHandler = () => {
        const value = options.getContent();
        const { document } = value;
        const change = value.change();
        change.undo();
        options.onChange(change);

    }
    return {
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