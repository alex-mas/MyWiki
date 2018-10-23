import * as React from 'react';
import { clipboard } from 'electron';



export class DynamicTextInput extends React.Component<any, { characters: number }>{
    constructor(props: any) {
        super(props);
        this.state = {
            characters: props.value ? props.value.length : 0
        }
    }
    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        debugger;
        const selection = window.getSelection().toString();
        if (event.key === 'Backspace') {
            this.setState((prevState) => {
                let characters = prevState.characters;
                if (selection) {
                    characters -= selection.length;
                } else {
                    characters--;
                }
                return {
                    characters
                };
            })
        }else if(event.ctrlKey && event.key === 'V'){
            const length= clipboard.readText().length;
            if(length){
                this.setState((prevState)=>({
                    characters: prevState.characters+length
                }));
            }
        }else{
            this.setState((prevState)=>({
                characters: prevState.characters+1
            }));
        }
        if (this.props.onKeyUp) {
            this.props.onKeyUp(event);
        }
    }
    render() {
        //input size grows larger when text size grows if we just specify the character count so we have to adjust it
        const width = this.state.characters*(1/(1+this.state.characters/250))-2;
        return (
            <input
                {...this.props}
                type="text"
                onKeyDown={this.onKeyDown}
                style={{
                    width: width > 0 ?`${width}ch` : '5ch',
                    ...this.props.style ? this.props.style : {}
                }}
            />
        )
    }
}


export default DynamicTextInput;