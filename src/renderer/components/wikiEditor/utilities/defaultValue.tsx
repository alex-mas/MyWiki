
import { Value} from 'slate';

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

export default defaultEditorContents;