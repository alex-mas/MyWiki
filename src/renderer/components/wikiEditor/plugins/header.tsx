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
                    const value = context.getContent();
                    const { document } = value;
                    if (!!value.blocks.some(block => block.type === type)) {
                        event.preventDefault();
                        //@ts-ignore
                        const change = value.change();
                        const key = value.blocks.get(value.blocks.size - 1).key;
                        change.removeNodeByKey(key);
                        change.insertBlock('');
                        change.moveAnchorToStartOfNextBlock();
                        change.moveToFocus();
                        context.onChange(change);
                    }
                }
            }
        });
    }
    return headerPlugins;
}

export default generateHeaderPlugins;