import * as React from 'react';
import TagInput from './tagInput';


export interface ComponentProps {
    tags: string[],
    onChange(newTags: string[]): any,
    toggled: boolean
}





class TagForm extends React.PureComponent<ComponentProps, any>{
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
                        <i className='material-icons'>add</i>
                    </button>
                </div>
            )
        } else {
            return null;
        }
    }
}



export default TagForm;