import * as React from 'react';
import { Editor, RenderNodeProps, RenderMarkProps } from 'slate-react';
import { Value, Change, Data, Schema } from 'slate';
import { connect } from 'react-redux';
import * as fs from 'fs';
import WikiLink from './wikiLink';
import Modal from '@axc/react-components/dist/layout/modal';
import EditorButton from './components/editorButton';
import { remote, Dialog } from 'electron';
import * as path from 'path';
//@ts-ignore
import { ResizableBox, Resizable } from 'react-resizable';



//plugins
import BoldPlugin from './plugins/marks/bold';
import ItalicPlugin from './plugins/marks/italic';
import UnderlinedPlugin from './plugins/marks/underlined';
import CodePlugin from './plugins/marks/code';
import generateHeaderPlugins from './plugins/blocks/header';
import generateAlignmentPlugins from './plugins/blocks/align';
import generateListPlugins from './plugins/blocks/lists';
import BlockQuotePlugin from './plugins/blocks/blockQuote';
import LinkPlugin from './plugins/blocks/link';



export type WikiEditorPluginCreator = (options: EditorPluginOptions) => WikiEditorPlugin;

export interface WikiEditorPlugin {

}

export interface EditorPluginOptions {
    getContent: () => Value,
    onChange: (change: Change) => any,
    isReadOnly: () => boolean
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



export interface WikiEditorState {
    isModalOpen: boolean,
    promptForText: boolean,
    linkText: string,
    linkDest: string,
    isOutLink: boolean,
    plugins: any[]
}

export interface WikiEditorStateProps {
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
            const pluginContext = this.getPluginContext();
            this.state = {
                isModalOpen: false,
                promptForText: false,
                linkText: undefined,
                linkDest: undefined,
                isOutLink: undefined,
                plugins: [
                    BoldPlugin(pluginContext),
                    ItalicPlugin(pluginContext),
                    UnderlinedPlugin(pluginContext),
                    CodePlugin(pluginContext),
                    ...generateHeaderPlugins(pluginContext),
                    ...generateAlignmentPlugins(pluginContext),
                    ...generateListPlugins(pluginContext),
                    BlockQuotePlugin(pluginContext),
                    LinkPlugin(pluginContext)
                ]
            }
        }
    }
    getPluginContext = () => {
        return {
            getContent: this.getContent,
            onChange: this.props.onChange,
            isReadOnly: this.isReadOnly
        }
    }
    getContent = () => {
        return this.props.content;
    }
    isReadOnly = () => {
        return this.props.readOnly;
    }
    renderNode = (props: RenderNodeProps) => {
        const { attributes, children, node } = props;
        //@ts-ignore
        switch (node.type) {
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
                if (type === 'image') {
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
    getMergedPlugins = () => {
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
                        {this.state.plugins.map((plugin) => {
                            if (plugin.Button) {
                                return <plugin.Button />;
                            } else {
                                return null;
                            }
                        })}
                        {BUTTON_NODE_TYPES.map((node) => {
                            return this.nodeButton(node.type, node.icon, node.data);
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
                </div>

            );
        }

    }
}

export const defaultPlugins: WikiEditorPlugin[] = [];

export default connect((state, props) => {
    return {
        plugins: defaultPlugins
    }
})(WikiEditor);