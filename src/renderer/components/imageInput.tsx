import * as React from 'react';
import { remote, Dialog, OpenDialogOptions } from 'electron';
import * as path from 'path';

const dialog: Dialog = remote.dialog;

export interface ImageInputProps {
    onChange(newValue: string): any,
    prompt: string,
    value?: string,
    windowTitle: string
    placeholder?: string,
    children?: any,
    className?:string
}

export class ImageInput extends React.PureComponent<ImageInputProps, any>{
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
        return (
            <div className={this.props.className ? this.props.className :'image-input'}>
                {!this.props.value && !this.props.placeholder ?
                    <span
                        className='image-input__label'
                    >
                        {this.props.value ? this.props.value : this.props.placeholder}
                    </span>
                    :
                    null
                }
                <button
                    type='button'
                    className='image-input__prompt'
                    onClick={this.changeBackgroundImage}
                >
                    {this.props.children ? this.props.children : this.props.prompt}
                </button>
            </div>
        )
    }
}


export default ImageInput;