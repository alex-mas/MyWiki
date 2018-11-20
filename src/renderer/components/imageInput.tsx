import * as React from 'react';
import { remote, Dialog, OpenDialogOptions } from 'electron';
import * as path from 'path';
import I18String from '@axc/react-components/display/i18string';
import { Button } from './button';

const dialog: Dialog = remote.dialog;

interface ComponentProps {
    onChange(newValue: string): any,
    prompt?: string,
    value?: string,
    windowTitle: string
    placeholder?: string,
    children?: any,
    className?: string
}

export class ImageInput extends React.PureComponent<ComponentProps, any>{
    changeBackgroundImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        dialog.showOpenDialog(remote.getCurrentWindow(), {
            title: this.props.windowTitle,
            filters: [{
                name: 'images',
                extensions: ['jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp', '.webp']
            }],
            properties: ['openFile']
        },
            (filePaths: string[]) => {
                if (filePaths.length === 1) {
                    const imagePath = path.relative(__dirname, filePaths[0]);
                    this.props.onChange(imagePath);
                }
            });
    }
    render() {
        const className = this.props.className ? this.props.className : 'image-input';
        return (
            <div className={className}>
                {this.props.placeholder ?
                    <span
                        className={`${className}__label`}
                    >
                        <I18String text={this.props.placeholder} format='capitalizeFirst' />
                    </span>
                    :
                    null
                }
                <Button
                    btnType='flat'
                    theme='primary'
                    className={`${className}__prompt`}
                    onClick={this.changeBackgroundImage}
                >
                    {this.props.children ?
                        this.props.children
                        :
                        <I18String text={this.props.prompt} format='capitalizeFirst' />
                    }

                </Button>
            </div>
        )
    }
}


export default ImageInput;