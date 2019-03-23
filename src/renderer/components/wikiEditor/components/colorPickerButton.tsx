import * as React from 'react';
import EditorButton, { EditorButtonProps } from "./editorButton";
import { SketchPicker, ColorChangeHandler, ColorResult } from "react-color";
import { Omit } from "../../../../utils/typeUtils";
import { EditorPluginContext } from "../wikiEditor";
import { hasMarkType, onClickMarkButton, toggleMark } from "../utilities/marks";
import { unwrapInline, toggleInline } from '../utilities/inlines';
import I18String from '@axc/react-components/i18string';

interface OwnProps {
    context: EditorPluginContext
}

interface ColorPresetObj {
    name: string,
    color: string
}
type ColorPreset = string | ColorPresetObj;

interface ComponentState {
    isColorPickerOpen: boolean,
    colorBookmarks: ColorPreset[],
    color: ColorResult
}
const black = {
    hsl: { a: 1, h: 0, l: 0, s: 0 },
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0, a: 1 }
  }
type ComponentProps = OwnProps & Omit<EditorButtonProps, "onClick">

const convertToPercentage = (decimal: number)=>{
    return (decimal*100).toFixed(2);
}

export class ColorPickerButton extends React.Component<ComponentProps, ComponentState>{
    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            color: props.data && props.data.color || black,
            isColorPickerOpen: false,
            //TODO: Put into the app config so its persistent across sessions and navigation
            colorBookmarks: [
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

        };
    }
    onStartPicking = (event: React.MouseEvent<HTMLSpanElement>, type?: string, data?: any) => {
        if (this.props.active) {
            unwrapInline(this.props.context.getEditor(), type, data);
            return;
        }
        this.setState(() => ({
            isColorPickerOpen: true
        }));
    }
    onFinishPicking = () => {
        const rgb = this.state.color.rgb;
        unwrapInline(this.props.context.getEditor(), this.props.type);
        toggleInline(this.props.context.getEditor(), this.props.type, { color: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`});
        this.setState(()=>({
            isColorPickerOpen: false
        }));
    }
    onChangeColor: ColorChangeHandler = (color) => {
        this.setState(() => ({
            color: color
        }));
    }
    onSaveColor = ()=>{
        this.setState((prevState)=>({
            colorBookmarks: [...prevState.colorBookmarks,prevState.color.hex]
        }));
    }
    render() {
        return (
            < >
                <EditorButton
                    {...this.props}
                    onClick={this.onStartPicking}
                />
                {this.state.isColorPickerOpen ?
                    <div className="wiki-editor__color-picker__wrapper">
                        <SketchPicker
                            color={this.state.color.rgb}
                            onChangeComplete={this.onChangeColor}
                            onChange={this.onChangeColor}
                            //@ts-ignore
                            presetColors={this.state.colorBookmarks}
                        />
                        <button
                            className='wiki-editor__color-picker__choose-button'
                            onClick={this.onFinishPicking}
                        >
                            <I18String text='choose' format='capitalizeFirst'/>
                        </button>
                        <button
                            className='wiki-editor__color-picker__preset-button'
                            onClick={this.onSaveColor}
                        >
                            <I18String text='save color' format='capitalizeFirst'/>
                        </button>
                    </div>
                    :
                    null
                }
            </>
        )
    }
}


