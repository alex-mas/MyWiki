import * as React from 'react';
import { RenderMarkProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton } from '../utilities/marks';
import { Value } from 'slate';



export const CodePlugin = (context: EditorPluginContext) => {

    const renderCodeBlock = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        return <code className='wiki-code-block' {...attributes}>{children}</code>;
    }

    const onClickButton = onClickMarkButton(context);

    return {
        id: 'code_block_plugin',
        renderMark: RenderMark('code', renderCodeBlock),
        Button() {
            const isActive = hasMarkType(context.getContent(), 'code');
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