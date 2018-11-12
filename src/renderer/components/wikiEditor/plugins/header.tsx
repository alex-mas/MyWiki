import * as React from 'react';
import { RenderNodeProps, Editor } from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { Value, BlockProperties } from 'slate';
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
                    console.log('executing enter handler')
                    const value = context.getContent();
                    const editor = context.getEditor();
                    if (!!value.blocks.some(block => block.type === type)) {
                        console.log('executing enter handler, block type detected');
                        event.preventDefault();
                        const key = value.blocks.get(value.blocks.size - 1).key;
                        editor.removeNodeByKey(key);
                        editor.insertBlock('');
                        editor.moveAnchorToStartOfNextBlock();
                        editor.moveToFocus();
                        return;
                    }
                }
                console.log('after executing enter handler', next, editor);
                return next();
              
            }
        });
    }
    return headerPlugins;
}

export default generateHeaderPlugins;