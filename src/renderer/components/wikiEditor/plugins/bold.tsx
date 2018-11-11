import * as React from 'react';
import { RenderMarkProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton } from '../utilities/marks';
import { Value } from 'slate';



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
        }
    }
}

export default BoldPlugin;