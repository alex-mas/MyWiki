import * as React from 'react';
import { RenderMarkProps} from "slate-react";
import { EditorPluginContext } from '../wikiEditor';
import EditorButton from '../components/editorButton';
import { hasMarkType, RenderMark, onClickMarkButton, toggleMark } from '../utilities/marks';
import { Value, Editor  } from 'slate';
import { ColorPickerButton } from '../components/colorPickerButton';



export const TextColorPlugin = (context: EditorPluginContext) => {

    const renderColoredText = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        return <span style={{color:mark.data.get("color")}}className='wiki-colored-text'{...attributes}>{children}</span>;
    }
    return {
        id: 'colored-text_plugin',
        renderMark: RenderMark('colored-text', renderColoredText),
        Button() {
            const isActive = hasMarkType(context.getContent(), 'colored-text');
            return (
                <ColorPickerButton
                    active={isActive}
                    icon='border_color'
                    type='colored-text'
                    context={context}
                />
            )
        }
    }
}

export default TextColorPlugin;