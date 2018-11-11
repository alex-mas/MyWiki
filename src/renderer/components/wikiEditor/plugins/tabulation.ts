import * as React from 'react';
import { RenderNodeProps, Editor } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value, BlockProperties } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const TabulationPlugin = (context: EditorPluginContext) => {

    return {
        id: 'tabulation_plugin',
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {  
            if (event.key === 'Tab') {
                event.preventDefault();
                const editor = context.getEditor();
                editor.insertText('\t');
            }
        }
    };
}

export default TabulationPlugin;