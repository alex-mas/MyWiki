import * as React from 'react';
import { EditorPluginOptions } from "../wikiEditor";
import EditorButton from './editorButton';
import { Value } from 'slate';
import { hasInlineType, wrapInline,unwrapInline } from '../utilities/inlines';
import Modal from '@axc/react-components/layout/modal';
import { hasBlockType } from '../utilities/blocks';


export class LinkButton extends React.Component<EditorPluginOptions, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            isModalOpen: false,
            linkDest: undefined,
            isOutLink: undefined
        }
    }

    closeModal = () => {
        this.setState(() => ({
            isModalOpen: false
        }));
    }

    addLink = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        const value = this.props.getContent();
        const hasLinks = hasInlineType(value,'link');
        const change = value.change();
        if (hasLinks) {
            //@ts-ignore
            change.call(unwrapInline(value, 'link'))
        } else if (value.selection.isExpanded) {
            if (this.state.isModalOpen) {
                this.closeModal();
                const dest = this.state.linkDest;
                const isOutLink = this.state.isOutLink;

                if (dest === null) {
                    return;
                }

                //@ts-ignore
                change.call(wrapInline,'link', {
                    href: dest, 
                    isOutLink
                });

            } else {
                this.setState(() => ({
                    isModalOpen: true,
                    promptForText: false
                }));
            }

        } else {
            if (this.state.isModalOpen) {
                this.closeModal();

                const dest = this.state.linkDest;
                const text = this.state.linkText;
                const isOutLink = this.state.isOutLink;

                if (dest === null || text === null) {
                    return;
                }
                //@ts-ignore
                change
                    .insertText(text)
                    .moveFocusBackward(text.length)
                    .call(wrapInline,'link', {
                        href: dest, 
                        isOutLink
                    });

            } else {
                this.setState(() => ({
                    isModalOpen: true,
                    promptForText: true
                }));
            }
        }
        this.props.onChange(change);
    }
    Button = () => {
        const isActive = hasBlockType(this.props.getContent(), 'link');
        return (
            <EditorButton
                onClick={this.addLink}
                active={isActive}
                icon={'link'}
                type={'link'}
            />
        );
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
                <input className='wiki-link__input' type="text" value={this.state.linkDest} onChange={this.onChangeLinkDest} />
                <div>
                    Is out link? <input type="checkbox" checked={this.state.isOutLink} onChange={this.onChangeLinkType} />
                </div>

                {this.state.promptForText ?
                    <input className='wiki-link__text__input' type="text" value={this.state.linkText} onChange={this.onChangeLinkText} />
                    :
                    null
                }
                <button className='wiki-link__form__action' onClick={this.addLink}>Accept</button>
            </div>
        );
    }
    render() {
        return (
            <React.Fragment>
                <this.Button />
                <Modal
                    isOpen={this.state.isModalOpen}
                    onClose={this.closeModal}
                >
                    <this.Form/>
                </Modal>
            </React.Fragment>
        )
    }
}

export default LinkButton;