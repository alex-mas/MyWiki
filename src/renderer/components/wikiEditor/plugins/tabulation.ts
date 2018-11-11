import * as React from 'react';
import { RenderNodeProps, Editor } from "slate-react";
import { EditorPluginOptions } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value, BlockProperties } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const TabulationPlugin = (options: EditorPluginOptions) => {

    return {
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {  
            if (event.key === 'Tab') {
                event.preventDefault();
                debugger;
                const value = options.getContent();
                const { document } = value;
                const change = value.change();
           
                change.insertText('\t');
                options.onChange(change);
   
            }
        }
    };
}

export default TabulationPlugin;