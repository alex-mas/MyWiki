import * as React from 'react';


export interface TagFormProps {
    tags: string[],
    onChange(newTags: string[]): any,
    toggled: boolean
}

interface TagInputProps {
    tag: string,
    index: number,
    onChange(tag: string, key: number): any,
    onRemove(index: number): any
}

class TagInput extends React.PureComponent<TagInputProps, any>{
    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        this.props.onChange(value, this.props.index);
    }
    onRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onRemove(this.props.index);
    }
    render() {
        return (
            <span className='tag'>
                <input
                    className='tag-input'
                    type="text"
                    value={this.props.tag}
                    onChange={this.onChange}
                />
                <button
                    className='tag-action'
                    onClick={this.onRemove}
                >
                    <i className='material-icons'>delete_forever</i>
                </button>
            </span>
        );
    }
}




class TagForm extends React.PureComponent<TagFormProps, any>{
    onChangeTag = (newTagValue: string, index: number) => {
        const newTags = this.props.tags.map((tag, currentIndex) => {
            if (currentIndex === index) {
                return newTagValue;
            } else {
                return tag;
            }
        });
        this.props.onChange(newTags);
    }
    onAddTag = () => {
        this.props.onChange([...this.props.tags, '']);
    }
    onRemoveTag = (index: number) => {
        this.props.onChange(this.props.tags.filter((tag, currentIndex) => index !== currentIndex));
    }
    render() {
        if (this.props.toggled) {
            return (
                <div className='tag-form'>
                    {this.props.tags.map((tag, index) => {
                        return (
                            <TagInput
                                tag={tag}
                                index={index}
                                onChange={this.onChangeTag}
                                onRemove={this.onRemoveTag}
                            />
                        );
                    })}
                    <button
                        className='tag-form__action'
                        onClick={this.onAddTag}
                    >
                        <i className='material-design'></i>New tag
                    </button>
                </div>
            )
        } else {
            return null;
        }
    }
}



export default TagForm;