import * as React from 'react';
import { Editor, RenderNodeProps, RenderMarkProps } from 'slate-react';
import { Value, Change, Data, Schema } from 'slate';
import {connect} from 'react-redux';
import * as fs from 'fs';
import WikiLink from './wikiLink';
import Modal from '@axc/react-components/dist/layout/modal';
import EditorButton from './editorButton';
import { remote, Dialog } from 'electron';
import * as path from 'path';
//@ts-ignore
import { ResizableBox, Resizable } from 'react-resizable';
import { BoldPlugin } from './plugins/marks/bold';
import { ItalicPlugin } from './plugins/marks/italic';
import { UnderlinedPlugin } from './plugins/marks/underlined';
import { CodePlugin } from './plugins/marks/code';
import { generateHeaderPlugins } from './plugins/blocks/header';



export type WikiEditorPluginCreator = (options: EditorPluginOptions)=>WikiEditorPlugin;

export interface WikiEditorPlugin{
    
}

export interface EditorPluginOptions {
    getContent: ()=>Value,
    onChange: (change: Change) => any
}



const dialog: Dialog = remote.dialog;

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
    },
    {
        type: 'image',
        icon: 'insert_photo',
        data: {
            width: '150',
            height: '150',
            src: '../../../../../../../../Media/public domain images/knight-armor-helmet-weapons-161936.jpeg'
        }
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
    isOutLink: boolean,
    plugins: any[]
}

export interface WikiEditorStateProps{
    plugins: WikiEditorPlugin[]
}

export interface WikiEditorOwnProps {
    content: Value,
    onChange: (change: Change) => any,
    readOnly: boolean
}
export type WikiEditorProps = WikiEditorOwnProps & WikiEditorStateProps;

class WikiEditor extends React.Component<WikiEditorProps, WikiEditorState> {
    state: Readonly<WikiEditorState> = {
        isModalOpen: false,
        promptForText: false,
        linkText: undefined,
        linkDest: undefined,
        isOutLink: undefined,
        plugins: []
    }
    constructor(props: any) {
        super(props);
        if (props.content) {
            this.state = {
                isModalOpen: false,
                promptForText: false,
                linkText: undefined,
                linkDest: undefined,
                isOutLink: undefined,
                plugins: [
                    BoldPlugin(this.getPluginContext()),
                    ItalicPlugin(this.getPluginContext()),
                    UnderlinedPlugin(this.getPluginContext()),
                    CodePlugin(this.getPluginContext()),
                    ...generateHeaderPlugins(this.getPluginContext())
                ]
            }
        }
    }
    getPluginContext = ()=>{
        return{
            getContent:this.getContent,
            onChange: this.props.onChange
        }
    }
    getContent = ()=>{
        return this.props.content;
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
            case 'image':
                console.log('rendering image to slate');
                return (
                    <div {...attributes}>

                        <ResizableBox
                            //@ts-ignore
                            width={Number(node.data.get('width'))}
                            //@ts-ignore
                            height={Number(node.data.get('height'))}
                            lockAspectRatio={true}
                        >
                            <span style={{ width: '100%', height: '100%' }} >
                                <img
                                    //@ts-ignore
                                    src={node.data.get('src')}
                                    //@ts-ignore
                                    style={{ width: '100%', height: '100%' }}
                                //style={{ width: node.data.get('width'), height: node.data.get('height') }}
                                />
                            </span>

                        </ResizableBox>

                    </div>
                );
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
                        const closestBlock = document.getClosest(block.key, parent => parent.type === type);
                        //@ts-ignore

                        return closestBlock && closestBlock.data && closestBlock.data.get('align') === data.align;
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
                } else if (type === 'image') {
                    dialog.showOpenDialog(remote.getCurrentWindow(), {
                        title: 'choose image source',
                        filters: [{
                            name: 'images',
                            extensions: ['jpg', 'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp', '.webp']
                        }],
                        properties: ['openFile']
                    },
                        (filePaths: string[]) => {
                            if (filePaths.length === 1) {
                                const imagePath = path.relative(__dirname, filePaths[0]);
                                console.log('Inserting image: ', imagePath, change);
                                change.insertBlock({
                                    type,
                                    data: {
                                        ...data,
                                        src: imagePath
                                    }
                                });
                                this.props.onChange(change);
                            }
                        });

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
        if (type === 'align') {
            const value = this.props.content;
            const block = value.blocks.first();
            if (block) {
                const parent = value.document.getParent(block.key);
                //@ts-ignore
                isActive = this.hasBlockType('align') || (parent && parent.type === type && parent.data.get('align') === data.align);
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
    getMergedPlugins = ()=>{
        return [...this.state.plugins, ...this.props.plugins];
    }
    render() {
        if (this.props.readOnly) {
            return (
                <Editor
                    plugins={this.state.plugins}
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
                        {this.state.plugins.map((plugin)=>{
                            if(plugin.Button){
                                return <plugin.Button/>;
                            }else{
                                return null;
                            }
                        })}
                        <EditorButton
                            onClick={this.addLink}
                            active={this.hasInlineType('link')}
                            type='link'
                            icon={'link'}
                            data={undefined}
                        />
                        {BUTTON_NODE_TYPES.map((node) => {
                            return this.nodeButton(node.type, node.icon, node.data);
                        })}
                        {BUTTON_INLINE_TYPES.map((inline) => {
                            return this.inlineButton(inline.type, inline.icon, inline.data);
                        })}
                    </div>
                    <Editor
                        plugins={this.state.plugins}
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

export const defaultPlugins: WikiEditorPlugin[] = [];

export default connect((state,props)=>{
    return{
        plugins: defaultPlugins
    }
})(WikiEditor);