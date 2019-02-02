import * as React from 'react';
import { RenderMarkProps, RenderNodeProps } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton } from '../utilities/marks';
import { Value } from 'slate';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles/hljs';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const CodePlugin = (context: EditorPluginContext) => {

    const renderCodeBlock = (props: RenderNodeProps) => {
        const { children, node, attributes } = props;
        console.log("Code node: ",node.text, node.getText());
        return (
            <div className='wiki-code-block' {...attributes}>
                <SyntaxHighlighter language='javascript' style={docco}>{node.getText()}</SyntaxHighlighter>
            </div>
        );
    }

    const onClickButton = onClickBlockButton(context);

    return {
        id: 'code_block_plugin',
        renderNode: RenderBlock('code', renderCodeBlock),
        Button() {
            const isActive = hasBlockType(context.getContent(), 'code');
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