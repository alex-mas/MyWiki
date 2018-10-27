import * as React from 'react';
import { RenderMarkProps } from "slate-react";
import { EditorPluginOptions } from '../../wikiEditor';
import EditorButton from '../../editorButton';
import { hasMarkType, RenderMark, onClickMarkButton} from '../../utilities/marks';
import { Value } from 'slate';



export const CodePlugin = (options: EditorPluginOptions) => {

    const renderCodeBlock = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        return <code className='wiki-code-block' {...attributes}>{children}</code>;
    }

    const onClickButton = onClickMarkButton(options.getContent,options.onChange);

    return {
        renderMark: RenderMark('code', renderCodeBlock),

        Button() {
            const isActive = hasMarkType(options.getContent(), 'code');
            return (
                <EditorButton
                    onClick={onClickButton}
                    active={isActive}
                    icon={'code'}
                    type={'code'}
                />
            )
        }
    }
}

export default CodePlugin;