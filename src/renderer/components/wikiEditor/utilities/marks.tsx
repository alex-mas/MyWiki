import { Value, MarkProperties, Editor } from "slate";
import { RenderMarkProps } from "slate-react";
import { EditorPluginContext } from "../wikiEditor";




export const hasMarkType = (content: Value, type: string) => {
    return content.activeMarks.some(mark => mark.type === type);
}


export const RenderMark = (type: string, fn: (props:RenderMarkProps)=>React.ReactNode)=>{
    return (props: RenderMarkProps, editor: Editor,next: Function)=>{
     
        if(props.mark.type === type){
            return fn(props);
        }else{
            return next();
        }
    }
}

export const onClickMarkButton = (context:EditorPluginContext)=>{
    return(event: React.MouseEvent<HTMLSpanElement>, type: string, data:any)=>{
        console.log("clicking mark button");
        event.preventDefault();
        event.stopPropagation();
        const editor = context.getEditor();
        editor.toggleMark({type,data});
    }
}
export const toggleMark = (editor: Editor,type:string,data?:any)=>{
    editor.toggleMark({type,data});
}


export default {
    hasMarkType,
    RenderMark,
    onClickMarkButton,
    toggleMark
}
