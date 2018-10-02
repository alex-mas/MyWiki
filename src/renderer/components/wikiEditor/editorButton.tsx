import * as React from 'react';

export interface EditorButtonProps {
    icon: string,
    onClick: (event: React.MouseEvent<HTMLSpanElement>, type: string) => void,
    active: boolean,
    type: string
}

export interface EditorButtonState {

}

export class EditorButton extends React.Component<EditorButtonProps, EditorButtonState>{
    onClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        this.props.onClick(event, this.props.type);
    }
    render() {
        return (
            <i
                className={`material-icons ${this.props.icon} ${this.props.active ? 'active-editor-icon' : 'inactive-editor-icon'}`}
                onClick={this.onClick}
            >
                {this.props.icon}
            </i>
        );
    }
}


export default EditorButton;



