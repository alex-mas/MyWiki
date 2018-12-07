import * as React from 'react';
import { RenderMarkProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton, toggleMark } from '../utilities/marks';
import { Value, Editor } from 'slate';



export const UnderlinedPlugin = (context: EditorPluginContext) => {

    const renderUnderlinedText = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        return <u className='wiki-underlined-text'{...attributes}>{children}</u>;
    }

    const onClickButton = onClickMarkButton(context);

    return {
        id: 'underlined_plugin',
        renderMark: RenderMark('underlined', renderUnderlinedText),
        Button() {
            const isActive = hasMarkType(context.getContent(), 'underlined');
            return (
                <EditorButton
                    onClick={onClickButton}
                    active={isActive}
                    icon={'format_underlined'}
                    type={'underlined'}
                />
            )
        },
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {
            if(event.ctrlKey && event.key === 'u'){
                toggleMark(editor,'underlined');
            }else{
                next();
            }
        }
    }
}

export default UnderlinedPlugin;