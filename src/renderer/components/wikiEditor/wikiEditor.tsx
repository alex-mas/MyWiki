import * as React from 'react';
import { Editor, RenderNodeProps, RenderMarkProps } from 'slate-react';
import { Value, Change } from 'slate';
import * as fs from 'fs';
import WikiLink from './wikiLink';
import Modal from '../../../../../../libraries/alex components/dist/layout/modal';
import EditorButton from './editorButton';

export const defaultEditorContents = Value.fromJSON({
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
});


export const DEFAULT_NODE = 'paragraph';


export const BUTTON_NODE_TYPES = [
    {
        type: 'link',
        icon: ''
    },
    {
        type: 'block-quote',
        icon: 'format_quote'
    },
    {
        type: 'bulleted-list',
        icon: 'format_list_bulleted'
    },
    {
        type: 'heading-one',
        icon: 'looks_one'
    },
    {
        type: 'heading-two',
        icon: 'looks_two'
    },
    {
        type: 'numbered-list',
        icon: 'format_list_numbered'
    }
]


export const BUTTON_MARK_TYPES = [
    {
        type: 'bold',
        icon: 'format_bold'
    },
    {
        type: 'code',
        icon: 'code'
    },
    {
        type: 'italic',
        icon: 'format_italic'
    },
    {
        type: 'underlined',
        icon: 'format_underlined'
    }
]



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
    isModalOpen: boolean,
    promptForText: boolean,
    linkText: string,
    linkDest: string
}

export interface WikiEditorProps {
    content: Value,
    onChange: (change: Change) => any,
    readOnly: boolean
}

class WikiEditor extends React.Component<WikiEditorProps, WikiEditorState> {
    state: Readonly<WikiEditorState> = {
        isModalOpen: false,
        promptForText: false,
        linkText: undefined,
        linkDest: undefined
    }
    constructor(props: any) {
        super(props);
        if (props.content) {
            this.state = {
                isModalOpen: false,
                promptForText: false,
                linkText: undefined,
                linkDest: undefined
            }
        }
    }
    renderNode = (props: RenderNodeProps) => {
        const { attributes, children, node } = props;
        //@ts-ignore
        switch (node.type) {
            case 'link':
                {
                    //@ts-ignore
                    const href = node.data.get('href');
                    return (
                        <WikiLink {...props} to={href} active={this.props.readOnly}>
                            {children}
                        </WikiLink>
                    );
                }
            case 'block-quote':
                return <blockquote {...attributes}>{children}</blockquote>
            case 'bulleted-list':
                return <ul {...attributes}>{children}</ul>
            case 'heading-one':
                return <h1 {...attributes}>{children}</h1>
            case 'heading-two':
                return <h2 {...attributes}>{children}</h2>
            case 'list-item':
                return <li {...attributes}>{children}</li>
            case 'numbered-list':
                return <ol {...attributes}>{children}</ol>
        }
    }
    renderMark = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        switch (mark.type) {
            case 'bold':
                return <strong {...attributes}>{children}</strong>
            case 'code':
                return <code {...attributes}>{children}</code>
            case 'italic':
                return <em {...attributes}>{children}</em>
            case 'underlined':
                return <u {...attributes}>{children}</u>
        }
    }

    hasInlineType = (type: string) => {
        return this.props.content.inlines.some(inline => inline.type === type);
    }
    hasMarkType = (type: string) => {
        return this.props.content.activeMarks.some(mark => mark.type === type);
    }

    hasBlockType = (type: string) => {
        return this.props.content.blocks.some(block => block.type === type)
    }

    onClickMark = (event: React.MouseEvent<HTMLElement>, type: string) => {
        event.preventDefault();
        const change = this.props.content.change().toggleMark(type);
        this.props.onChange(change);
    }


    onClickBlock = (event: React.MouseEvent<HTMLSpanElement>, type: string) => {
        event.preventDefault()
        const value = this.props.content;
        const change = value.change();
        const { document } = value;

        // Handle everything but list buttons.
        if (type != 'bulleted-list' && type != 'numbered-list') {
            const isActive = this.hasBlockType(type)
            const isList = this.hasBlockType('list-item')

            if (isList) {
                change
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {
                change.setBlocks(isActive ? DEFAULT_NODE : type)
            }
        } else {
            // Handle the extra wrapping required for list buttons.
            const isList = this.hasBlockType('list-item')
            const isType = value.blocks.some(block => {
                //@ts-ignore
                return !!document.getClosest(block.key, parent => parent.type == type)
            })

            if (isList && isType) {
                change
                    .setBlocks(DEFAULT_NODE)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else if (isList) {
                change
                    .unwrapBlock(
                        type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                    )
                    .wrapBlock(type)
            } else {
                change.setBlocks('list-item').wrapBlock(type);
            }
        }

        this.props.onChange(change);
    }

    addLink = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        const value = this.props.content;
        const hasLinks = this.hasInlineType('link');
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
        this.props.onChange(change);
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
    markButton = (type: string, icon: string) => {
        const isActive = this.hasMarkType(type);
        return (
            <EditorButton
                onClick={this.onClickMark}
                active={isActive}
                icon={icon}
                type={type}
            />
        )
    }
    nodeButton = (type: string, icon: string) => {
        let isActive = this.hasBlockType(type);

        //@ts-ignore
        if (['numbered-list', 'bulleted-list'].includes(type)) {
            const value = this.props.content;
            const parent = value.document.getParent(value.blocks.first().key);
            //@ts-ignore
            isActive = this.hasBlockType('list-item') && parent && parent.type === type;
        }

        return (
            <EditorButton
                active={isActive}
                onClick={this.onClickBlock}
                type={type}
                icon={icon}
            />
        )
    }
    render() {
        console.log(this.props);
        if (this.props.readOnly) {
            return (
                <Editor
                    renderMark={this.renderMark}
                    readOnly={this.props.readOnly}
                    value={this.props.content}
                    onChange={this.props.onChange}
                    renderNode={this.renderNode}
                />
            )
        } else {
            return (
                <div>
                    <div id='editor__actions'>
                        <EditorButton
                            onClick={this.addLink}
                            active={this.hasInlineType('link')}
                            type='link'
                            icon='link'
                        />
                        {BUTTON_MARK_TYPES.map((mark) => {
                            return this.markButton(mark.type, mark.icon);
                        })}
                        {BUTTON_NODE_TYPES.map((node) => {
                            return this.nodeButton(node.type, node.icon);
                        })}

                    </div>
                    <Editor
                        renderMark={this.renderMark}
                        readOnly={this.props.readOnly}
                        value={this.props.content}
                        onChange={this.props.onChange}
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