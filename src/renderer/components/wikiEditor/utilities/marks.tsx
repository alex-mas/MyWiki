import { Value, MarkProperties } from "slate";
import { RenderMarkProps } from "slate-react";




export const hasMarkType = (content: Value, type: string) => {
    return content.activeMarks.some(mark => mark.type === type);
}


export const RenderMark = (type: string, fn: (props:RenderMarkProps)=>React.ReactNode)=>{
    return (props: RenderMarkProps, next: Function)=>{
        if(props.mark.type){
            return fn(props);
        }else{
            next();
        }
    }
}

export const onClickMarkButton = (getContent: ()=>Value, onChange: Function)=>{
    return(event: React.MouseEvent<HTMLSpanElement>, type: string, data:any)=>{
        console.log('here!', type,);
        event.preventDefault();
        const change = getContent().change().toggleMark({type,data});
        onChange(change);
    }
}

export default {
    hasMarkType,
    RenderMark,
    onClickMarkButton
}
