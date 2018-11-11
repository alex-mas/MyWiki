import * as React from 'react';
import { EditorPluginContext } from '../wikiEditor';
import EditorButton, { EditorButtonClickHandler } from '../components/editorButton';




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
        }
    };
}

export default RedoPlugin;