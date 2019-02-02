import * as React from 'react';
import { Value } from 'slate';

export type EditorButtonClickHandler = (event: React.MouseEvent<HTMLSpanElement>, type?: string,data?:any) => void;


export interface ComponentProps {
    icon: string,
    onClick: EditorButtonClickHandler,
    active: boolean,
    type?: string,
    data?:any
}

export type EditorButtonProps = ComponentProps;

interface ComponentState {

}

export class EditorButton extends React.Component<ComponentProps, ComponentState>{
    onClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const extraArgs = [ this.props.type, this.props.data];
        this.props.onClick(event, ...extraArgs);
    }
    render() {
        console.log("re-rendering editor button");
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



