import * as React from 'react';
import { EditorPluginContext } from "../wikiEditor";
import EditorButton from './editorButton';
import { Value, Editor } from 'slate';
import { hasInlineType, wrapInline, unwrapInline } from '../utilities/inlines';
import Modal from '@axc/react-components/modal';
import { hasBlockType } from '../utilities/blocks';

type ComponentProps = EditorPluginContext;

interface ComponentState {
    isModalOpen: boolean;
    linkDest: string;
    linkText: string;
    isOutLink: boolean;
    promptForText: boolean;
}

export class LinkButton extends React.Component<ComponentProps, ComponentState>{
    constructor(props: any) {
        super(props);
        this.state = {
            isModalOpen: false,
            linkDest: undefined,
            isOutLink: undefined,
            promptForText: false,
            linkText: undefined
        }
    }

    closeModal = () => {
        this.setState(() => ({
            isModalOpen: false
        }));
    }
    toggleLink = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        const value = this.props.getContent();
        const editor = this.props.getEditor();
        const hasLinks = hasInlineType(value, 'link');
        if (hasLinks) {
            unwrapInline(editor, 'link');
        } else {
            this.openForm();
        }
    }

    openForm = () => {
        const value = this.props.getContent();
        this.setState(() => ({
            isModalOpen: true,
            promptForText: !value.selection.isExpanded
        }));
    }
    addLink = () => {
        this.closeModal();
        const value = this.props.getContent();
        const editor = this.props.getEditor();
        const dest = this.state.linkDest;
        const isOutLink = this.state.isOutLink;
        const text = this.state.linkText;

        if (dest === null) {
            return;
        }
        if (!value.selection.isExpanded) {
            editor
                .insertText(text)
                .moveFocusBackward(text.length);
        }

        wrapInline(editor, 'link', {
            href: dest,
            isOutLink
        });
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
    Form = () => {
        return (
            <div className='wiki-link__form'>
                <div className='form__field'>
                    Link destination
                    <input
                        className='form-input'
                        type='text'
                        value={this.state.linkDest}
                        onChange={this.onChangeLinkDest}
                    />
                </div>

                <div className='form__field'>
                    Is out link?
                    <input
                        className='form-input'
                        type='checkbox'
                        checked={this.state.isOutLink}
                        onChange={this.onChangeLinkType}
                    />
                </div>

                {this.state.promptForText ?
                    <div className='form__field'>
                        Link Text
                        <input
                            className='form-input'
                            type='text'
                            value={this.state.linkText}
                            onChange={this.onChangeLinkText}
                        />
                    </div>
                    :
                    null
                }
                <button
                    type='button'
                    className='button-solid--primary'
                    onClick={this.addLink}
                >
                    Accept
                </button>
            </div>
        );
    }
    render() {
        const isActive = hasInlineType(this.props.getContent(), 'link');
        return (
            <React.Fragment>
                <EditorButton
                    onClick={this.toggleLink}
                    active={isActive}
                    icon='link'
                    type='link'
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

export default LinkButton;



