import * as React from 'react';
import { RenderMarkProps} from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton, toggleMark } from '../utilities/marks';
import { Value, Editor  } from 'slate';



export const BoldPlugin = (context: EditorPluginContext) => {

    const renderBoldText = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        return <strong className='wiki-bold-text'{...attributes}>{children}</strong>;
    }

    const onClickButton = onClickMarkButton(context);

    return {
        id: 'bold_plugin',
        renderMark: RenderMark('bold', renderBoldText),
        Button() {
            const isActive = hasMarkType(context.getContent(), 'bold');
            return (
                <EditorButton
                    onClick={onClickButton}
                    active={isActive}
                    icon={'format_bold'}
                    type={'bold'}
                />
            )
        },
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {
            if(event.ctrlKey && event.key === 'b'){
                toggleMark(editor,'bold');
            }else{
                next();
            }
        }

    }
}

export default BoldPlugin;