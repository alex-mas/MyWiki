import * as React from 'react';
import { RenderMarkProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton, toggleMark } from '../utilities/marks';
import { Value, Editor } from 'slate';



export const ItalicPlugin = (context: EditorPluginContext) => {

    const renderItalicText = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        return <em className='wiki-italic-text'{...attributes}>{children}</em>;
    }

    const onClickButton = onClickMarkButton(context);

    return {
        id: 'italic_plugin',
        renderMark: RenderMark('italic', renderItalicText),
        Button() {
            const isActive = hasMarkType(context.getContent(), 'italic');
            return (
                <EditorButton
                    onClick={onClickButton}
                    active={isActive}
                    icon={'format_italic'}
                    type={'italic'}
                />
            )
        },
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {
            if(event.ctrlKey && event.key === 'i'){
                toggleMark(editor,'italic');
            }else{
                next();
            }
        }
    }
}

export default ItalicPlugin;