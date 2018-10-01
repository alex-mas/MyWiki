import * as React from 'react';
import { Editor, RenderNodeProps } from 'slate-react';
import { Value, Change } from 'slate';
import * as fs from 'fs';
import WikiLink from './wikiLink';
import Modal from '../../../../../../libraries/alex components/dist/layout/modal';

const initialValue = Value.fromJSON({
    document: {
        nodes: [
            {
                object: 'block',
                type: 'paragraph',
                nodes: [
                    {
                        object: 'text',
                        leaves: [
                            {
                                text: 'A line of text in a paragraph.',
                            },
                        ],
                    },
                ],
            },
        ],
    },
})



function wrapLink(change: Change, href: string) {
    console.log('Href: ', href);
    change.wrapInline({
        type: 'link',
        data: { href }
    });
    change.moveToEnd()
}



function unwrapLink(change: Change) {
    change.unwrapInline('link')
}


export interface WikiEditorState {
    value: Value,
    isModalOpen: boolean,
    promptForText: boolean,
    linkText: string,
    linkDest: string
}

class WikiEditor extends React.Component<any, WikiEditorState> {
    state: Readonly<WikiEditorState> = {
        value: initialValue,
        isModalOpen: false,
        promptForText: false,
        linkText: undefined,
        linkDest: undefined
    }
    constructor(props:any){
        super(props);
        if(props.content){
            this.state = {
                value: Value.fromJSON(props.content),
                isModalOpen: false,
                promptForText: false,
                linkText: undefined,
                linkDest: undefined
            }
        }
    }
    onChange = (change: Change) => {
        const value = change.value;
        this.setState(() => ({ value }));
    }
    renderNode = (props: RenderNodeProps) => {
        const { attributes, children, node } = props;
        debugger;
        //@ts-ignore
        switch (props.node.type) {
            case 'link':
                {
                    //@ts-ignore
                    const href = node.data.get('href');
                    return (
                        <WikiLink {...props} to={href}>
                            {children}
                        </WikiLink>
                    );
                }
        }
    }
    hasLinks = () => {
        const { value } = this.state;
        return value.inlines.some(inline => inline.type == 'link')
    }
    addLink = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { value } = this.state;
        const hasLinks = this.hasLinks();
        const change = value.change();

        if (hasLinks) {
            //@ts-ignore
            change.call(unwrapLink)
        } else if (value.selection.isExpanded) {
            if (this.state.isModalOpen) {
                this.closeModal();
                const dest = this.state.linkDest;

                if (dest === null) {
                    return;
                }

                //@ts-ignore
                change.call(wrapLink, dest);

            } else {
                this.setState(() => ({
                    isModalOpen: true,
                    promptForText: false
                }));
            }

        } else {
            if (this.state.isModalOpen) {
                debugger;
                this.closeModal();

                const dest = this.state.linkDest;
                const text = this.state.linkText;

                if (dest === null || text === null) {
                    return;
                }
                //@ts-ignore
                change
                    .insertText(text)
                    .moveFocusBackward(text.length)
                    .call(wrapLink, dest);

            } else {
                this.setState(() => ({
                    isModalOpen: true,
                    promptForText: true
                }));
            }
        }
        this.onChange(change);
    }
    closeModal = () => {
        this.setState(() => ({
            isModalOpen: false
        }));
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

    saveChanges = ()=>{
        this.props.saveChanges(this.state.value.toJSON());
    }
    discardChanges = () =>{
        this.props.discardChanges(this.state.value.toJSON());
    }
    render() {
        if (this.props.readOnly) {
            return (
                <Editor
                    readOnly={this.props.readOnly}
                    value={this.state.value}
                    onChange={this.onChange}
                    renderNode={this.renderNode}
                />
            )
        }else{
            return (
                <div>
                    <div>
                        <button onClick={this.saveChanges}>Save changes</button>
                        <button onClick={this.discardChanges}>Discard changes</button>
                    </div>
                    <div id='editor__actions'>
                        <button onClick={this.addLink}>Add Link</button>
                    </div>
                    <Editor
                        readOnly={this.props.readOnly}
                        value={this.state.value}
                        onChange={this.onChange}
                        renderNode={this.renderNode}
                    />
                    <Modal
                        isOpen={this.state.isModalOpen}
                        onClose={this.closeModal}
                    >
                        <div>
                            <input type="text" value={this.state.linkDest} onChange={this.onChangeLinkDest} />
                            {this.state.promptForText ?
                                <input type="text" value={this.state.linkText} onChange={this.onChangeLinkText} />
                                :
                                null
                            }
                            <button onClick={this.addLink}>Accept</button>
                        </div>
                    </Modal>
                </div>
    
            );
        }

    }
}


export default WikiEditor;