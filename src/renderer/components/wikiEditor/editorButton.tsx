import * as React from 'react';
import { Value } from 'slate';

export interface EditorButtonProps {
    icon: string,
    onClick: (event: React.MouseEvent<HTMLSpanElement>, type: string,data:any) => void,
    active: boolean,
    type: string,
    data?:any
}

export interface EditorButtonState {

}

export class EditorButton extends React.Component<EditorButtonProps, EditorButtonState>{
    onClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        this.props.onClick(event, this.props.type,this.props.data);
    }
    render() {
        return (
            <i
                className={`material-icons ${this.props.active ? 'editor-btn' : 'editor-btn--inactive'}`}
                onClick={this.onClick}
            >
                {this.props.icon}
            </i>
        );
    }
}


export default EditorButton;



