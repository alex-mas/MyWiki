import * as React from 'react';
import { Editor, RenderNodeProps, RenderMarkProps } from 'slate-react';
import { Value, Change, Data, Schema } from 'slate';
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


export const BUTTON_NODE_TYPES: { type: string, icon: string, data: any }[] = [
    {
        type: 'block-quote',
        icon: 'format_quote',
        data: undefined
    },
    {
        type: 'bulleted-list',
        icon: 'format_list_bulleted',
        data: undefined
    },
    {
        type: 'heading-one',
        icon: 'looks_one',
        data: undefined
    },
    {
        type: 'heading-two',
        icon: 'looks_two',
        data: undefined
    },
    {
        type: 'heading-three',
        icon: 'looks_3',
        data: undefined
    },
    {
        type: 'heading-four',
        icon: 'looks_4',
        data: undefined
    },
    {
        type: 'heading-five',
        icon: 'looks_5',
        data: undefined
    },
    {
        type: 'heading-six',
        icon: 'looks_6',
        data: undefined
    },
    {
        type: 'numbered-list',
        icon: 'format_list_numbered',
        data: undefined
    },
    {
        type: 'align',
        icon: 'format_align_left',
        data: {
            align: 'left'
        }
    },
    {
        type: 'align',
        icon: 'format_align_right',
        data: {
            align: 'right'
        }
    },
    {
        type: 'align',
        icon: 'format_align_center',
        data: {
            align: 'center'
        }
    }
]


export const BUTTON_MARK_TYPES: { type: string, icon: string, data: any }[] = [
    {
        type: 'bold',
        icon: 'format_bold',
        data: undefined
    },
    {
        type: 'code',
        icon: 'code',
        data: undefined
    },
    {
        type: 'italic',
        icon: 'format_italic',
        data: undefined
    },
    {
        type: 'underlined',
        icon: 'format_underlined',
        data: undefined
    }
]


export const BUTTON_INLINE_TYPES: any[] = [

];


const schema: Schema = {
    //@ts-ignore
    nodes: {
        paragraph: function (props: RenderNodeProps) {
            const { node, attributes, children } = props
            //@ts-ignore
            const textAlign = node.data.get('align') || 'left'
            const style = { textAlign }
            return <p style={style} {...attributes}>{children}</p>
        }
    }
}


const wrapInline = (change: Change, type: string, data?: any) => {
    change.wrapInline({
        type,
        data: data ? data : {}
    }).moveToEnd();
};


const unwrapInline = (change: Change, type: string) => {
    change.unwrapInline(type);
}





function wrapLink(change: Change, href: string, isOutLink: boolean = false) {
    console.log('Href: ', href);
    change.wrapInline({
        type: 'link',
        data: { href, isOutLink }
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
    linkDest: string,
    isOutLink: boolean
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
        linkDest: undefined,
        isOutLink: undefined
    }
    constructor(props: any) {
        super(props);
        if (props.content) {
            this.state = {
                isModalOpen: false,
                promptForText: false,
                linkText: undefined,
                linkDest: undefined,
                isOutLink: undefined
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
                    //@ts-ignore
                    const isOutLink = node.data.get('isOutLink');
                    return (
                        <WikiLink
                            {...props}
                            to={href}
                            active={this.props.readOnly}
                            className='wiki-link'
                            isOutLink={isOutLink}
                        >
                            {children}
                        </WikiLink>
                    );
                }
            case 'block-quote':
                return <blockquote {...attributes} className='wiki-block-quote'>
                    {children}
                </blockquote>
            case 'bulleted-list':
                return <ul {...attributes} className='wiki-bulleted-list'>
                    {children}
                </ul>
            case 'heading-one':
                return <h1 {...attributes} className='wiki-heading'>
                    {children}
                </h1>
            case 'heading-two':
                return <h2 {...attributes} className='wiki-heading'>{children}</h2>
            case 'heading-three':
                return <h3 {...attributes} className='wiki-heading'>{children}</h3>
            case 'heading-four':
                return <h4 {...attributes} className='wiki-heading'>{children}</h4>
            case 'heading-five':
                return <h5 {...attributes} className='wiki-heading'>{children}</h5>
            case 'heading-six':
                return <h6 {...attributes} className='wiki-heading'>{children}</h6>
            case 'list-item':
                return <li {...attributes} className='wiki-list-item'>{children}</li>
            case 'numbered-list':
                return <ol {...attributes} className='wiki-numbered-list'>{children}</ol>
            case 'align':
                return (
                    //@ts-ignore
                    <div {...attributes} style={{ textAlign: node.data.get('align') }}>
                        {children}
                    </div>
                );
        }
    }
    renderMark = (props: RenderMarkProps) => {
        const { children, mark, attributes } = props;
        switch (mark.type) {
            case 'bold':
                return <strong className='wiki-bold-text'{...attributes}>{children}</strong>
            case 'code':
                return <code className='wiki-code-block' {...attributes}>{children}</code>
            case 'italic':
                return <em className='wiki-italic-text'{...attributes}>{children}</em>
            case 'underlined':
                return <u className='wiki-underlined-text'{...attributes}>{children}</u>
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


    onClickBlock = (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault()
        const value = this.props.content;
        const change = value.change();
        const { document } = value;


        const isType = value.blocks.some(block => {
            //@ts-ignore
            return !!document.getClosest(block.key, parent => parent.type == type)
        });
        const isList = this.hasBlockType('list-item');

        // Handle everything but list buttons.
        if (type != 'bulleted-list' && type != 'numbered-list') {
            const isActive = this.hasBlockType(type)

            if (isList) {
                change
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {

                if (type === 'align') {


                    const isSameAlignment = value.blocks.some(block => {
                        //@ts-ignore
                        return !!document.getClosest(block.key, parent => parent.type == type && parent.data.align === data.align)
                    });
                    if (isType) {
                        if (isSameAlignment) {
                            change.unwrapBlock({
                                type,
                                data
                            });
                        } else {
                            change
                                .unwrapBlock({
                                    type
                                })
                                .wrapBlock({
                                    type,
                                    data
                                })
                                .moveToEnd();
                        }

                    } else {
                        change.wrapBlock({
                            type,
                            data
                        }).moveToEnd();
                    }
                } else {
                    change.setBlocks(isActive ? DEFAULT_NODE : {
                        type,
                        data
                    });
                }
            }
        } else {
            // Handle the extra wrapping required for list buttons.
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

    onClickInline = (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault();
        const value = this.props.content;
        const isActive = this.hasInlineType(type);
        const change = value.change();
        if (isActive) {
            //@ts-ignore
            change.call(unwrapInline, type, data);
        } else if (value.selection.isExpanded) {
            //@ts-ignore
            change.call(wrapInline, type, data);
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
                const isOutLink = this.state.isOutLink;

                if (dest === null) {
                    return;
                }

                //@ts-ignore
                change.call(wrapLink, dest, isOutLink);

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
                    .call(wrapLink, dest, isOutLink);

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
    onChangeLinkType = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isOutLink = e.target.checked;
        console.log(isOutLink);
        this.setState(() => ({
            isOutLink
        }));
    }


    markButton = (type: string, icon: string, data: any) => {
        const isActive = this.hasMarkType(type);
        return (
            <EditorButton
                onClick={this.onClickMark}
                active={isActive}
                icon={icon}
                type={type}
                data={data}
            />
        )
    }
    nodeButton = (type: string, icon: string, data: any) => {
        let isActive = this.hasBlockType(type);

        //@ts-ignore
        if (['numbered-list', 'bulleted-list'].includes(type)) {
            const value = this.props.content;
            const block = value.blocks.first();
            if (block) {
                const parent = value.document.getParent(block.key);
                //@ts-ignore
                isActive = this.hasBlockType('list-item') && parent && parent.type === type;
            }
        }

        return (
            <EditorButton
                active={isActive}
                onClick={this.onClickBlock}
                type={type}
                icon={icon}
                data={data}
            />
        )
    }
    inlineButton = (type: string, icon: string, data: any) => {
        let isActive = this.hasInlineType(type);
        return (
            <EditorButton
                active={isActive}
                onClick={this.onClickInline}
                type={type}
                icon={icon}
                data={data}
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
                    className='wiki-editor'
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
                            data={undefined}
                        />
                        {BUTTON_MARK_TYPES.map((mark) => {
                            return this.markButton(mark.type, mark.icon, mark.data);
                        })}
                        {BUTTON_NODE_TYPES.map((node) => {
                            return this.nodeButton(node.type, node.icon, node.data);
                        })}
                        {BUTTON_INLINE_TYPES.map((inline) => {
                            return this.inlineButton(inline.type, inline.icon, inline.data);
                        })}
                    </div>
                    <Editor
                        renderMark={this.renderMark}
                        readOnly={this.props.readOnly}
                        value={this.props.content}
                        onChange={this.props.onChange}
                        renderNode={this.renderNode}
                        className='wiki-editor'
                        schema={schema}
                    />
                    <Modal
                        isOpen={this.state.isModalOpen}
                        onClose={this.closeModal}
                    >
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
                    </Modal>
                </div>

            );
        }

    }
}


export default WikiEditor;