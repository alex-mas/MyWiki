import Modal from '@axc/react-components/modal';
import { dialog } from 'electron';
import * as imageSize from 'image-size';
import * as React from 'react';
import { urlImageSize } from '../../../../utils/image';
import { hasBlockType } from '../utilities/blocks';
import { DEFAULT_NODE, EditorPluginContext } from "../wikiEditor";
import EditorButton from './editorButton';

const defaultImageData = {
  height: '150',
  width: '150',
  src: '../../../../../../../../Media/public domain images/knight-armor-helmet-weapons-161936.jpeg'
};

type ComponentProps = EditorPluginContext


type FormProps = any;

class ImageButtonForm extends React.Component<FormProps, any> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      isFromUrl: false,
      url: ''
    };
  }
  triggerFromUrl = () => {
    this.setState(() => ({
      isFromUrl: true
    }));
  }
  onChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    this.setState(() => ({
      url
    }));
  }
  addImage = () => {
    this.props.addImageToDocument(this.state.url);
  }
  render() {
    return (
      <div className='wiki-link__form form'>
        {this.state.isFromUrl ?
          <>
            <div className='form__field'>
              Insert a valid url
              <input
                className='form__text-input'
                placeholder='image url'
                type="text"
                value={this.state.url}
                onChange={this.onChangeUrl}
              />
            </div>
            <div className='form__actions'>
              <button
                type='button'
                className='button-solid--primary'
                onClick={this.addImage}
              >
                Add
              </button>
            </div>

          </>
          :
          <div className='form__actions'>
            <button
              type='button'
              className='button-solid--primary'
              onClick={this.props.addImage}
            >
              From file
            </button>

            <button
              type='button'
              className='button-solid--primary'
              onClick={this.triggerFromUrl}
            >
              From url
            </button>
          </div>
        }
      </div>
    )
  }
}

export class ImageButton extends React.Component<ComponentProps, any>{
  constructor(props: any) {
    super(props);
    this.state = {
      isModalOpen: false
    }
  }

  closeModal = () => {
    this.setState(() => ({
      isModalOpen: false
    }));
  }
  openForm = () => {
    const value = this.props.getContent();
    this.setState(() => ({
      isModalOpen: true
    }));
  }

  toggleIamgeForm = () => {
    event.preventDefault();
    const value = this.props.getContent();
    const editor = this.props.getEditor();
    const isImage = hasBlockType(this.props.getContent(), 'image');
    if (isImage) {
      this.addImage(undefined);
    } else {
      this.openForm();
    }
  }

  addImage = (event?: any) => {
    if (event) {
      event.preventDefault();
    }

    const value = this.props.getContent();
    const editor = this.props.getEditor();
    const { document } = value;


    const isType = value.blocks.some(block => {
      //@ts-ignore
      return !!document.getClosest(block.key, parent => parent.type == 'image')
    });
    const isList = hasBlockType(value, 'list-item');

    const isActive = hasBlockType(value, 'image');

    if (isList) {
      editor
        .setBlocks(isActive ? DEFAULT_NODE : 'image')
        .unwrapBlock('bulleted-list')
        .unwrapBlock('numbered-list')
    } else {
      if (!isActive) {
        dialog.showOpenDialog({
          title: 'choose image source',
          filters: [{
            name: 'images',
            extensions: ['jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp', '.webp']
          }],
          properties: ['openFile']
        }).then(
          ({ filePaths }) => {
            if (filePaths.length === 1) {
              const imagePath = filePaths[0];
              this.addImageToDocument(imagePath);
            }
          });
      } else {
        const key = value.blocks.find(block => block.type === 'image').key;
        if (key) {
          editor.removeNodeByKey(key);
        }
      }

    }
  }
  addImageToDocument = async (imagePath: string) => {
    const editor = this.props.getEditor();
    console.log('Inserting image: ', imagePath, editor);
    let size: any;
    try {
      size = imageSize(imagePath);
    }
    catch (e) {
      size = urlImageSize(imagePath);
    }
    await size;
    const imageRatio = size.width / size.height;

    editor.insertBlock({
      type: 'image',
      data: {
        ...defaultImageData,
        src: imagePath,
        height: '500',
        width: String(imageRatio * 500)
      }
    });
    editor.insertBlock({
      type: 'paragraph'
    });
    this.closeModal();
  }
  onChangeLinkDest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const linkDest = e.target.value;
    this.setState(() => ({
      linkDest
    }));
  }
  onChangeLinkText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const linkText = e.target.value;
    this.setState(() => ({
      linkText
    }));
  }
  onChangeLinkType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isOutLink = e.target.checked;
    console.log(isOutLink);
    this.setState(() => ({
      isOutLink
    }));
  }
  render() {
    const isActive = hasBlockType(this.props.getContent(), 'image');
    return (
      <React.Fragment>
        <EditorButton
          onClick={this.toggleIamgeForm}
          active={isActive}
          icon={'insert_photo'}
          type={'image'}
          data={{
            height: '150',
            width: '150',
            src: '../../../../../../../../Media/public domain images/knight-armor-helmet-weapons-161936.jpeg'
          }}
        />
        <Modal
          className='modal'
          isOpen={this.state.isModalOpen}
          onClose={this.closeModal}
        >
          <ImageButtonForm
            addImage={this.addImage}
            addImageToDocument={this.addImageToDocument}
          />
        </Modal>
      </React.Fragment>
    )
  }
}

export default ImageButton;