import * as React from 'react';
import { Editor, EditorState, ContentBlock, BlockMap, BlockMapBuilder, DraftBlockType, RichUtils, DraftInlineStyleType, convertToRaw, convertFromRaw } from 'draft-js';
import * as Immutable from 'immutable';
import StyleButton from './styleButton';

type CustomBlockType = DraftBlockType | 'card' | 'link';

const INLINE_STYLES: { label: string, style: DraftInlineStyleType }[] = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Code', style: 'CODE' },
    { label: 'strikethrought', style: 'STRIKETHROUGH' }
];

const BLOCK_TYPES: { label: string, style: CustomBlockType }[] = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];



export class MyEditor extends React.Component<any, {editorState: EditorState, articleName: string}> {
    constructor(props: any) {
        super(props);
        let editorState: EditorState;
        if (this.props.content) {
            editorState = EditorState.createWithContent(convertFromRaw(this.props.content));
        } else {
            editorState = EditorState.createEmpty();
        }
        this.state = {
            editorState,
            articleName: undefined
        };
    }

    onSaveArticle = (event: React.MouseEvent<HTMLButtonElement>) => {

    }
    
    onChangeArticleName = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const articleName = event.target.value;
        this.setState((prevState)=>({
            articleName
        }));
        
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


    toggleBlockType = (blockType: any) => {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    toggleInlineStyle = (inlineStyle: any) => {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
        console.log(this.state.editorState);
        console.log(convertToRaw(this.state.editorState.getCurrentContent()));
    }

    BlockStyleButtons = (props: any) => {
        const { editorState } = props;
        const selection = editorState.getSelection();
        const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();

        return (
            <div className="RichEditor-controls">
                {BLOCK_TYPES.map((type) =>
                    <StyleButton
                        key={type.label}
                        active={type.style === blockType}
                        label={type.label}
                        onToggle={props.onToggle}
                        style={type.style}
                    />
                )}
            </div>
        );
    }

    InlineStyleButtons = (props: any) => {
        const currentStyle = props.editorState.getCurrentInlineStyle();
        return (
            <div className="RichEditor-controls">
                {INLINE_STYLES.map((type) =>
                    <StyleButton
                        key={type.label}
                        active={currentStyle.has(type.style)}
                        label={type.label}
                        onToggle={props.onToggle}
                        style={type.style}
                    />
                )}
            </div>
        );
    }
    //in wiki-editor contrls we set up the buttons that trigger actions such as converting selected blocks to other types, add new elements such as cards,etc, 
    //via RichUtils api from draftjs or via custom functions mutating the state via its methods.
    render() {
        return (
            <div className='wiki-editor'>
                <input
                    type="text"
                    value={this.state.articleName}
                    placeholder={'article name'}
                    onChange={this.onChangeArticleName}
                />
                <button onClick={this.onSaveArticle}>Save changes</button>
                <div className='wiki-editor__controls'>
                    <this.BlockStyleButtons
                        editorState={this.state.editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <this.InlineStyleButtons
                        editorState={this.state.editorState}
                        onToggle={this.toggleInlineStyle}
                    />
                </div>
                <div className='wiki-editor__editor'>
                    <Editor
                        readOnly={this.props.readOnly}
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