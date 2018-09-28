import * as React from 'react';
import { Editor, EditorState, ContentBlock, BlockMap, BlockMapBuilder, DraftBlockType, RichUtils } from 'draft-js';
import * as Immutable from 'immutable';

type CustomBlockType = DraftBlockType | 'card' | 'link';


export class MyEditor extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
        };
    }

    _onBoldClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }
    onChange = (editorState: EditorState) => this.setState({ editorState });

    //Here we define what to do when contentBlock is of custom type
    blockRenderer = (contentBlock: ContentBlock) => {
        const type: string = contentBlock.getType();
        switch (type) {
            case 'link':
                break;
            default:
                break;
        }
    }
    //in wiki-editor contrls we set up the buttons that trigger actions such as converting selected blocks to other types, add new elements such as cards,etc, 
    //via RichUtils api from draftjs or via custom functions mutating the state via its methods.
    render() {
        return (
            <div className='wiki-editor'>
                <div className='wiki-editor__controls'>
                    <button onClick={this._onBoldClick.bind(this)}>Bold</button>
                </div>
                <div className='wiki-editor__editor'>
                    <Editor
                        blockRendererFn={this.blockRenderer}
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                    />
                </div>
            </div>

        );
    }
}


export default MyEditor;