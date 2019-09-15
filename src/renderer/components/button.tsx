import * as React from 'react';






interface ComponentProps extends React.HTMLProps<HTMLButtonElement> {
    btnType: 'flat' | 'solid';
    theme: 'primary' | 'secondary';
    mode?: 'regular' | 'accent' | 'disabled';

}

export class Button extends React.PureComponent<ComponentProps, any>{
    static defaultProps = {
        mode: 'regular'
    }
    getClassName = () => {
        let baseClassName = `button-${this.props.btnType}`;
        if (this.props.btnType === 'solid') {
            if (this.props.mode === 'accent') {
                baseClassName += `--${this.props.mode}`;
            } else {
                baseClassName += `--${this.props.theme}`;
            }
        } else if (this.props.btnType === 'flat') {
            baseClassName += `--${this.props.theme}`;
            if (this.props.mode !== 'regular') {
                baseClassName += `--${this.props.mode}`;
            }
        }
        if(this.props.className){
            baseClassName += ` ${this.props.className}`;
        }
        return baseClassName;
    }
    getDomProps =()=>{
        const props = {
            ...this.props
        }
        delete props.theme;
        delete props.mode;
        delete props.btnType;
        delete props.className;
        return props;
    }
    render() {
        return (
            <button
                {...this.getDomProps()}
                type={this.props.type ? this.props.type as any : 'button'}
                className={this.getClassName()}
            >
                {this.props.children}
            </button>
        )
    }
}


export type ButtonProps = ComponentProps;
