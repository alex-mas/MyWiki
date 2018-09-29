import * as React from 'react';


export interface StyleButtonProps{
    label: string,
    style: string,
    onToggle: Function,
    active: boolean,
}


export class StyleButton extends React.Component<StyleButtonProps, any> {
    constructor(props: any) {
        super(props);
    }
    onToggle = (e: React.MouseEvent<HTMLSpanElement>) =>{
        e.preventDefault();
        this.props.onToggle(this.props.style);
    }
    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}




export default StyleButton