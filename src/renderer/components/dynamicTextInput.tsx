import * as React from 'react';
import { clipboard } from 'electron';

interface ComponentProps extends React.HTMLProps<HTMLInputElement>{
    defaultWidth: number
}

interface ComponentState{
    width: string
}

export class DynamicTextInput extends React.Component<ComponentProps, ComponentState>{
    widthCalcRef: React.RefObject<HTMLDivElement> = React.createRef();
    constructor(props: any) {
        super(props);
        this.state= {
            width: 'auto'
        };
    }
    getTextWidth(){
        if(this.widthCalcRef && this.widthCalcRef.current){
        
            let width: any =this.widthCalcRef.current.clientWidth;
            if(width === 0){
                width = this.props.defaultWidth;
            }
            width += 10;
            width +='px';
            this.setState(()=>({
                width
            }));
        }

    }
    componentDidUpdate(prevProps: ComponentProps){
        console.log('dynamic tex input updating');
        if(prevProps.value !== this.props.value){
            this.getTextWidth();
        }
        
    }
    componentDidMount(){
        this.getTextWidth();
    }
    render() {
        return (
            <>
            <input
                {...this.props}
                style={{
                    ...this.props.style,
                    width: this.state.width
                }}
                type="text"
            />
            <span key='widthCalc' className={this.props.className} style={{
                visibility: "hidden",
                position: 'absolute'
            }} ref={this.widthCalcRef}>{this.props.value || this.props.placeholder}</span>
            </>
        )
    }
}


export default DynamicTextInput;