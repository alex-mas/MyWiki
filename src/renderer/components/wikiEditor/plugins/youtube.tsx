
/*
Define button that pops up a dialog -> 

Choice 1: Youtube link
Enter a youtube link -> 
Render an iframe with the youtube video

Choice 2: Native video
Display a file selection Dialog
Render a native html video element
*/


import * as React from 'react';
import { EditorPluginContext, DEFAULT_NODE } from '../wikiEditor';
import EditorButton, { EditorButtonClickHandler } from '../components/editorButton';
import { Editor } from 'slate';
import { RenderBlock, hasBlockType } from '../utilities/blocks';
import { RenderNodeProps } from 'slate-react';
import { YoutubeVideo } from '../components/youtubeVideo';
import YoutubeButton from '../components/youtubeBtn';




export const YoutubePlugin = (context: EditorPluginContext) => {

    const type = 'youtube_video'
    const renderYoutubeVideo = (props: RenderNodeProps) => {
        return (
            <YoutubeVideo {...props} pluginContext={context} />
        );
    }
    return {
        renderNode: RenderBlock('youtube_video',renderYoutubeVideo),
        id: 'youtube_video',
        Button() {
            return (
                <YoutubeButton
                    {...context}
                />
            );
        }
    };
}

export default YoutubePlugin;