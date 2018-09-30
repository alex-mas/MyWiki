import * as React from 'react';
import { Editor, RenderNodeProps } from 'slate-react'
import { Value, Change } from 'slate'
import WikiLink from './wikiLink';

const initialValue = Value.fromJSON({
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
})



function wrapLink(change: Change, to: string) {
    change.wrapInline({
        type: 'link',
        data: { to },
    });
    change.moveToEnd()
}



function unwrapLink(change: Change) {
    change.unwrapInline('link')
}



class WikiEditor extends React.Component<any, any> {
    state = {
        value: initialValue,
    }
    onChange = (change: Change) => {
        const value = change.value;
        this.setState(() => ({ value }));
    }
    renderNode = (props: RenderNodeProps) => {
        //@ts-ignore
        switch (props.node.type) {
            case 'link':
                //@ts-ignore
                return <WikiLink {...props} />

        }
    }
    hasLinks = () => {
        const { value } = this.state
        return value.inlines.some(inline => inline.type == 'link')
    }
    addLink = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { value } = this.state
        const hasLinks = this.hasLinks()
        const change = value.change()

        if (hasLinks) {
            //@ts-ignore
            change.call(unwrapLink)
        } else if (value.selection.isExpanded) {
            const href = window.prompt('Enter the URL of the link:')

            if (href === null) {
                return
            }
            //@ts-ignore
            change.call(wrapLink, href)
        } else {
            const href = window.prompt('Enter the URL of the link:')

            if (href === null) {
                return
            }

            const text = window.prompt('Enter the text for the link:')

            if (text === null) {
                return
            }
            //@ts-ignore
            change
                .insertText(text)
                .moveFocusBackward(text.length)
                .call(wrapLink, href)
        }

        this.onChange(change)
    }
    render() {
        return (
            <div>
                <button onClick={this.addLink}>Add Link</button>
                <Editor
                    value={this.state.value}
                    onChange={this.onChange}
                    renderNode={this.renderNode}
                />
            </div>

        );
    }
}


export default WikiEditor;