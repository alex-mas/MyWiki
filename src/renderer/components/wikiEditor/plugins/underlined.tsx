import * as React from 'react';
import { RenderMarkProps } from "slate-react";
import { EditorPluginOptions } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton} from '../utilities/marks';
import { Value } from 'slate';



export const UnderlinedPlugin = (options: EditorPluginOptions) => {

    const renderUnderlinedText = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        return <u className='wiki-underlined-text'{...attributes}>{children}</u>;
    }

    const onClickButton = onClickMarkButton(options.getContent,options.onChange);

    return {
        renderMark: RenderMark('underlined', renderUnderlinedText),

        Button() {
            const isActive = hasMarkType(options.getContent(), 'underlined');
            return (
                <EditorButton
                    onClick={onClickButton}
                    active={isActive}
                    icon={'format_underlined'}
                    type={'underlined'}
                />
            )
        }
    }
}

export default UnderlinedPlugin;