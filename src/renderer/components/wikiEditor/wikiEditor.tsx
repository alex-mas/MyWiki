import * as React from 'react';
import { Editor as SlateEditor, RenderNodeProps, RenderMarkProps, Plugin } from 'slate-react';
import { Value, Data, Schema, Block, Editor, BlockJSON } from 'slate';
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
import UndoPlugin from './plugins/undo';
import RedoPlugin from './plugins/redo';
import TablePlugin from './plugins/tables';
import { generatePluginID } from './utilities/plugin';



export type WikiEditorPluginCreator = (context: EditorPluginContext) => WikiEditorPlugin;

export interface WikiEditorPlugin extends Plugin {
    id: string,
    Button: React.ComponentClass<any> | React.SFCFactory<any>
}

export interface EditorPluginContext {
    getContent: () => Value,
    getEditor: ()=>Editor,
    onChange: (change: { operations: any, value: Value }) => any,
    isReadOnly: () => boolean
}


const dialog: Dialog = remote.dialog;

export const emptyParagraph: BlockJSON = {
    object: 'block',
    type: 'paragraph'
};

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
    plugins: WikiEditorPluginCreator[]
}

export interface WikiEditorOwnProps {
    content: Value,
    onChange: (change: { operations: any, value: Value }) => any,
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
    editor: React.Ref<Editor>;
    constructor(props: any) {
        super(props);
        if (props.content) {
            this.editor = React.createRef();
            this.state = {
                isModalOpen: false,
                promptForText: false,
                linkText: undefined,
                linkDest: undefined,
                isOutLink: undefined,
                plugins: this.getPlugins()
            }
        }
    }

    getPluginContext = () => {
        return {
            getEditor: this.getEditor,
            getContent: this.getContent,
            onChange: this.props.onChange,
            isReadOnly: this.isReadOnly
        }
    }
    getEditor = ()=>{
        if(typeof this.editor === 'object'){
            return this.editor.current as Editor;
        }else{
            throw new Error('attempted to acces editor when its ref is not yet set');
        }
    }
    getContent = () => {
        return this.props.content;
    }
    isReadOnly = () => {
        return this.props.readOnly;
    }
    getPlugins = () => {
        const pluginContext = this.getPluginContext();
        const plugins =[
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
            RedoPlugin(pluginContext),
            TablePlugin(pluginContext),
            ...this.props.plugins.map((pluginConstructor)=>{
                const plugin = pluginConstructor(pluginContext);
                if(plugin.id){
                    return plugin;
                }else{
                    return generatePluginID(plugin);
                }
            })
        ];
        return plugins;
    }
    render() {
        if (this.props.readOnly) {
            return (
                <SlateEditor
                    //@ts-ignore
                    ref={this.editor}
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
                    <div key='editor__actions' className='editor__actions'>
                        {this.state.plugins.map((plugin: WikiEditorPlugin) => {
                            if (plugin.Button) {
                                return <plugin.Button key={plugin.id} />;
                            } else {
                                return null;
                            }
                        })}
                    </div>
                    <SlateEditor
                        key='wiki-editor'
                        //@ts-ignore
                        ref={this.editor}
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

export const defaultPlugins: WikiEditorPluginCreator[] = [];

export default connect((state, props) => {
    return {
        plugins: defaultPlugins
    }
})(WikiEditor);