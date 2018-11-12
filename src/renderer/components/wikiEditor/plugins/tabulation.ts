import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value, BlockProperties, Editor} from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';
import { generatePluginID } from '../utilities/plugin';
import Hotkey from '../utilities/keybinds';



export const TabulationPlugin = (context: EditorPluginContext) => {

    return {
        id: 'tabulation_plugin',
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {  
            if (event.key === 'Tab') {
                event.preventDefault();
                editor.insertText('\t');
            }
            return next();
        }
    };
}


export default TabulationPlugin;