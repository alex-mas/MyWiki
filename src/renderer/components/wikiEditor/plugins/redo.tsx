import * as React from 'react';
import { RenderNodeProps, Editor } from "slate-react";
import { EditorPluginOptions } from '../wikiEditor';
import EditorButton, { EditorButtonClickHandler } from '../components/editorButton';
import { Value, BlockProperties } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const RedoPlugin = (options: EditorPluginOptions) => {
    const redo: EditorButtonClickHandler = () => {
        const value = options.getContent();
        const { document } = value;
        const change = value.change();
        change.redo();
        options.onChange(change);
    }
    return {
        Button() {
            return (
                <EditorButton
                    onClick={redo}
                    active={false}
                    icon={'redo'}
                />
            );
        }
    };
}

export default RedoPlugin;