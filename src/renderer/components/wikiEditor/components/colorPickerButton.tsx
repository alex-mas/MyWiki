import * as React from 'react';
import EditorButton, { EditorButtonProps } from "./editorButton";
import { SketchPicker, ColorChangeHandler} from "react-color";
import { Omit } from "../../../../utils/typeUtils";
import { EditorPluginContext } from "../wikiEditor";
import { hasMarkType, onClickMarkButton, toggleMark } from "../utilities/marks";
import { unwrapInline, toggleInline } from '../utilities/inlines';

interface OwnProps{
    context: EditorPluginContext
}

interface ComponentState {
    isColorPickerOpen: boolean
}

type ComponentProps = OwnProps & Omit<EditorButtonProps, "onClick">

const defaultColorBookmarks = [
    {
        name: 'white',
        color: '#FFFFFF'
    },
    {
        name: 'black',
        color: '#000000'
    },
    {
        name: 'red',
        color: '#ff0000'
    },
    {
        name: 'blue',
        color: '#0000ff'
    },
    {
        name: 'violet',
        color: '#8a2be2'
    },
    {
        name: 'cyan',
        color: '#00ffff'
    },
    {
        name: 'gold',
        color: '#ffd700'
    },
    {
        name: 'gray',
        color: '#707070'
    },
    {
        name: 'yellow',
        color: '#ffff00'
    }
]

export class ColorPickerButton extends React.Component<ComponentProps,ComponentState>{
    constructor(props: ComponentProps){
        super(props);
        this.state = {
            isColorPickerOpen: false
        };
    }
    onStartPicking =(event: React.MouseEvent<HTMLSpanElement>, type?: string,data?:any)=>{
        if(this.props.active){
            unwrapInline(this.props.context.getEditor(),type,data);
            return;
        }
        this.setState(()=>({
            isColorPickerOpen:true
        }));
    }
    onFinishPicking: ColorChangeHandler = (color)=>{
        toggleInline(this.props.context.getEditor(),this.props.type, {color:color.hex});
        this.setState(()=>({isColorPickerOpen: false}));
    }
    render(){
        return(
            < >
                <EditorButton
                    {...this.props}
                    onClick={this.onStartPicking}
                /> 
                {this.state.isColorPickerOpen ? 
                    <div className="wiki-editor__color-picker__wrapper">
                        <SketchPicker
                            onChangeComplete={this.onFinishPicking}
                            //@ts-ignore
                            presetColors={defaultColorBookmarks}
                            
                        />
                    </div>
                    :
                    null
                }
            </>
        )
    }
}


