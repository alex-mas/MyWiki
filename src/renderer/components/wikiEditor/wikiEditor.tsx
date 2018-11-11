import * as React from 'react';
import { Editor, RenderNodeProps, RenderMarkProps } from 'slate-react';
import { Value, Change, Data, Schema, Block } from 'slate';
import { connect } from 'react-redux';
import { remote, Dialog } from 'electron';


//plugins
import BoldPlugin from './plugins/bold';
import ItalicPlugin from './plugins/italic';
import UnderlinedPlugin from './plugins/underlined';
import CodePlugin from './plugins/code';
import generateHeaderPlugins from './plugins/header';
import generateAlignmentPlugins from './plugins/align';
import generateListPlugins from './plugins/lists';
import BlockQuotePlugin from './plugins/blockQuote';
import LinkPlugin from './plugins/link';
import ImagePlugin from './plugins/image';
import TabulationPlugin from './plugins/tabulation';
import { UndoPlugin } from './plugins/undo';
import { RedoPlugin } from './plugins/redo';



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
                                text: 'Insert your content here',
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
    },
    //@ts-ignore
    normalize: (editor: any, { code, node, child }) => {
        switch (code) {
            case 'last_child_type_invalid': {
                const paragraph = Block.create('paragraph')
                return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
            }
        }
    },

    blocks: {
        image: {
            isVoid: true,
        },
    },
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
                    LinkPlugin(pluginContext),
                    ImagePlugin(pluginContext),
                    TabulationPlugin(pluginContext),
                    UndoPlugin(pluginContext),
                    RedoPlugin(pluginContext)
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
                    className='wiki-editor'
                />
            )
        } else {
            return (
                <div>
                    <div className='editor__actions'>
                        {this.state.plugins.map((plugin) => {
                            if (plugin.Button) {
                                return <plugin.Button />;
                            } else {
                                return null;
                            }
                        })}
                    </div>
                    <Editor
                        plugins={this.state.plugins}
                        readOnly={this.props.readOnly}
                        value={this.props.content}
                        onChange={this.props.onChange}
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