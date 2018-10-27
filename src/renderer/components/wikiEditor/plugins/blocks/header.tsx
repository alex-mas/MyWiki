import * as React from 'react';
import { RenderNodeProps } from "slate-react";
import { EditorPluginOptions } from '../../wikiEditor';
import EditorButton from '../../editorButton';
import { Value } from 'slate';
import { RenderBlock, hasBlockType, onClickBlockButton } from '../../utilities/blocks';



export const generateHeaderPlugins = (options: EditorPluginOptions) => {

    const renderHeader = (HeaderComponent: string)=>{
        return(props: RenderNodeProps) => {
            const { children, node, attributes } = props;
            return <HeaderComponent className='wiki-heading'{...attributes}>{children}</HeaderComponent>;
        }
    }
    const onClickButton = onClickBlockButton(options.getContent,options.onChange);

    const numberToWords = ['zero','one', 'two', 'three', 'four', 'five', 'six']

    const headerPlugins = [];

    for(let i = 1; i<=6; i++){
        const type = `heading-${numberToWords[i]}`;
        let icon = `looks_${i}`;
        if(i < 3){
            icon = `looks_${numberToWords[i]}`;
        } 
        const element = `h${i}`;
        headerPlugins.push({
            renderNode: RenderBlock(type,renderHeader(element)),
            Button(){
                const isActive = hasBlockType(options.getContent(), type);
                return (
                    <EditorButton
                        onClick={onClickButton}
                        active={isActive}
                        icon={icon}
                        type={type}
                    />
                );
            }
        });
    }
    return headerPlugins;
}

export default generateHeaderPlugins;