import * as React from 'react';
import { RenderMarkProps } from "slate-react";
import { EditorPluginOptions } from '../wikiEditor';
import EditorButton from '../editorButton';
import { hasMarkType, RenderMark, onClickMarkButton} from '../utilities/marks';
import { Value } from 'slate';



export const BoldPlugin = (options: EditorPluginOptions) => {

    const renderBoldText = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        return <strong className='wiki-bold-text'{...attributes}>{children}</strong>
    }

    const onClickButton = onClickMarkButton(options.getContent,options.onChange);

    return {
        renderMark: RenderMark('bold', renderBoldText),

        Button() {
            const isActive = hasMarkType(options.getContent(), 'bold');
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