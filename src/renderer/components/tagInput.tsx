import * as React from 'react';
import DynamicTextInput from "./dynamicTextInput";



interface TagInputProps {
    tag: string,
    index: number,
    onChange(tag: string, key: number): any,
    onRemove(index: number): any
}

export class TagInput extends React.PureComponent<TagInputProps, any>{
    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        this.props.onChange(value, this.props.index);
    }
    onRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onRemove(this.props.index);
    }
    render() {
        return (
            <div className='tag'>
                <DynamicTextInput
                    className='tag-input'
                    placeholder='new tag'
                    value={this.props.tag}
                    onChange={this.onChange}
                />
                <button
                    className='tag-action'
                    onClick={this.onRemove}
                >
                    <i className='material-icons'>clear</i>
                </button>
            </div>
        );
    }
}


export default TagInput;