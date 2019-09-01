import * as React from 'react';
import { EditorPluginContext, DEFAULT_NODE } from "../wikiEditor";
import EditorButton from './editorButton';
import Modal from '@axc/react-components/modal';
import { hasBlockType } from '../utilities/blocks';
import { i18n } from '../../../app';
import I18String from '@axc/react-components/i18string';

type ComponentProps = EditorPluginContext;

interface ComponentState {
    isModalOpen: boolean;
    videoId: string;
    videoLink: string,
    error: string
}

export class YoutubeButton extends React.Component<ComponentProps, ComponentState>{
    constructor(props: any) {
        super(props);
        this.state = {
            isModalOpen: false,
            videoId: undefined,
            videoLink: undefined,
            error: undefined
        }
    }

    closeModal = () => {
        this.setState(() => ({
            isModalOpen: false
        }));
    }

    openForm = () => {
        this.setState(() => ({
            isModalOpen: true
        }));
    }
    onClickYoutubeBtn = (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault();
        const value = this.props.getContent();
        const editor = this.props.getEditor();
        const { videoId } = this.state;
        const { document } = value;


        const isType = value.blocks.some(block => {
            //@ts-ignore
            return !!document.getClosest(block.key, parent => parent.type == type)
        });
        const isList = hasBlockType(value, 'list-item');

        // Handle everything but list buttons.
        if (type != 'bulleted-list' && type != 'numbered-list') {
            const isActive = hasBlockType(value, type);

            if (isList) {
                editor
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {
                if (!isActive) {
                    this.openForm();
                } else {
                    const key = value.blocks.find(block => block.type === type).key;
                    if (key) {
                        editor.removeNodeByKey(key);
                    }
                }

            }
        } else {
            // Handle the extra wrapping required for list buttons.
            if (isList && isType) {
                editor
                    .setBlocks(DEFAULT_NODE)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else if (isList) {
                editor
                    .unwrapBlock(
                        type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                    )
                    .wrapBlock(type)
            } else {
                editor.setBlocks('list-item').wrapBlock(type);
            }
        }
    }

    addVideo = () => {
        this.closeModal();
        const value = this.props.getContent();
        const editor = this.props.getEditor();
        const { videoId } = this.state;
        if (!videoId) {
            return;
        }
        editor.insertBlock({
            type: 'youtube_video',
            data: {
                videoId,
                height: '200'
            }
        });
        editor.insertBlock({
            type: 'paragraph'
        });
    }

    parseVideoId = (link: string) => {
        if (!link) {
            throw new Error(i18n(' empty urls are not valid'));
        }
        if (!link.includes('https://www.youtube.com/watch?v=')) {
            throw new Error(i18n(' video link is not a yotube video, please enter a valid youtube link'));
        }
        return link.split('https://www.youtube.com/watch?v=')[1];

    }
    onChangeVideoLink = (e: React.ChangeEvent<HTMLInputElement>) => {
        const videoLink = e.target.value;
        try {
            const videoId = this.parseVideoId(videoLink);
            this.setState(() => ({
                videoId,
                videoLink
            }));
        } catch (e) {
            this.setState(() => ({
                error: e.message
            }));
        }

    }
    Form = () => {
        return (
            <div className='wiki-ytb__form form'>
                {this.state.error ?
                    <div
                        className='text--error'
                    >
                        <I18String
                            text='input error'
                            format='capitalizeFirst'
                        />

                        {this.state.error}
                    </div>
                    :
                    undefined
                }
                <div className='form__field'>
                    Youtube Link
                    <input
                        className='form__text-input'
                        placeholder='youtube url'
                        type="text"
                        value={this.state.videoLink}
                        onChange={this.onChangeVideoLink}
                    />
                </div>
                <div className='form__actions'>
                    <button
                        type='button'
                        className='button-solid--primary form__action'
                        onClick={this.addVideo}
                    >
                        Accept
                    </button>
                </div>

            </div>
        );
    }
    render() {
        const isActive = hasBlockType(this.props.getContent(), 'youtube_video');
        return (
            <React.Fragment>
                <EditorButton
                    onClick={this.onClickYoutubeBtn}
                    active={isActive}
                    icon='subscriptions'
                    type='youtube_video'
                />
                <Modal
                    className='modal'
                    isOpen={this.state.isModalOpen}
                    onClose={this.closeModal}
                >
                    <this.Form />
                </Modal>
            </React.Fragment>
        )
    }
}

export default YoutubeButton;