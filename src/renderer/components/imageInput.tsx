import I18String from '@axc/react-components/i18string';
import { dialog } from 'electron';
import * as path from 'path';
import * as React from 'react';
import { i18n } from '../app';
import { Button } from './button';


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
    dialog.showOpenDialog({
      title: i18n(this.props.windowTitle),
      filters: [{
        name: 'images',
        extensions: ['jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp', '.webp']
      }],
      properties: ['openFile']
    }).then(
      ({ filePaths }) => {
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
          mode='disabled'
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