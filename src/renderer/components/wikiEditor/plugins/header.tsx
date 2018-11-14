import * as React from 'react';
import { RenderNodeProps, Editor } from "slate-react";
import { EditorPluginContext, emptyParagraph } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value, BlockProperties, Node, Block } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../utilities/blocks';



export const generateHeaderPlugins = (context: EditorPluginContext) => {

    const renderHeader = (HeaderComponent: string) => {
        return (props: RenderNodeProps) => {
            const { children, node, attributes } = props;
            return <HeaderComponent className='wiki-article-header'{...attributes}>{children}</HeaderComponent>;
        }
    }
    const onClickButton = onClickBlockButton(context);

    const numberToWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six']

    const headerPlugins = [];

    for (let i = 1; i <= 6; i++) {
        const type = `heading-${numberToWords[i]}`;
        let icon = `looks_${i}`;
        if (i < 3) {
            icon = `looks_${numberToWords[i]}`;
        }
        const element = `h${i}`;
        headerPlugins.push({
            id: `header_${i}_plugin`,
            renderNode: RenderBlock(type, renderHeader(element)),
            Button() {
                const isActive = hasBlockType(context.getContent(), type);
                return (
                    <EditorButton
                        onClick={onClickButton}
                        active={isActive}
                        icon={icon}
                        type={type}
                    />
                );
            },
            onKeyUp: (event: React.KeyboardEvent<any>, editor: Editor, next: Function) => {
                if (event.key === 'Enter') {
                    const value = context.getContent();
                    const editor = context.getEditor();
                    if (!!value.blocks.some(block => block.type === type)) {
                        event.preventDefault();
                        event.stopPropagation();
                        const current = value.blocks.get(value.blocks.size -2);
                        const previous = value.previousBlock;
                        debugger;
                        if(current.type === type && current.text === ''){
                            const key = current.key;
                            editor.removeNodeByKey(key);
                            editor.insertBlock('');
                            editor.moveAnchorToStartOfNextBlock();
                        }else if(previous.type === type && previous.text === ''){
                            editor.replaceNodeByKey(previous.key, Block.fromJSON(emptyParagraph));
                        }
                        return false;
                    }
                }
                return next();
              
            }
        });
    }
    return headerPlugins;
}

export default generateHeaderPlugins;