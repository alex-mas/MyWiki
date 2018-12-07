import * as React from 'react';
import { EditorPluginContext } from '../wikiEditor';
import EditorButton, { EditorButtonClickHandler } from '../components/editorButton';
import { Editor } from 'slate';




export const RedoPlugin = (context: EditorPluginContext) => {
    const redo: EditorButtonClickHandler = () => {
        context.getEditor().redo();
    }
    return {
        id: 'redo_plugin',
        Button() {
            return (
                <EditorButton
                    onClick={redo}
                    active={false}
                    icon={'redo'}
                />
            );
        },
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {
            if(event.ctrlKey && event.key === 'y'){
                editor.redo();
            }else{
                next();
            }
        }
    };
}

export default RedoPlugin;