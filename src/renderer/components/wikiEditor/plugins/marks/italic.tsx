import * as React from 'react';
import { RenderMarkProps } from "slate-react";
import { EditorPluginOptions } from '../../wikiEditor';
import EditorButton from '../../editorButton';
import { hasMarkType, RenderMark, onClickMarkButton} from '../../utilities/marks';
import { Value } from 'slate';



export const ItalicPlugin = (options: EditorPluginOptions) => {

    const renderItalicText = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        return <em className='wiki-italic-text'{...attributes}>{children}</em>;
    }

    const onClickButton = onClickMarkButton(options.getContent,options.onChange);

    return {
        renderMark: RenderMark('italic', renderItalicText),

        Button() {
            const isActive = hasMarkType(options.getContent(), 'italic');
            return (
                <EditorButton
                    onClick={onClickButton}
                    active={isActive}
                    icon={'format_italic'}
                    type={'italic'}
                />
            )
        }
    }
}

export default ItalicPlugin;