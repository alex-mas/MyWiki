import * as React from 'react';
import { RenderNodeProps} from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton, { EditorButtonClickHandler } from '../components/editorButton';
import { Value, BlockProperties, Editor} from 'slate';
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
        },
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {
            if(event.ctrlKey && event.key === 'z'){
                editor.undo
                editor.undo();
            }else{
                next();
            }
        }
    };
}

export default UndoPlugin;