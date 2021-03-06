
import { Value} from 'slate';

export const defaultEditorContents = Value.fromJSON({
    document: {
        nodes: [
            {
                //@ts-ignore
                object: "block",
                type: 'paragraph',
                nodes: [
                    {
                        object: 'text',
                        leaves: [
                            {
                                object: 'leaf',
                                text: 'Insert your content here',
                            },
                        ],
                    },
                ],
            },
        ],
    },
});

export default defaultEditorContents;