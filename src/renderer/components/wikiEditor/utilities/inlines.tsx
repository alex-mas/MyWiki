import { Value, MarkProperties, Editor } from "slate";
import { RenderMarkProps } from "slate-react";



export const hasInlineType = (content: Value, type: string) => {
    return content.inlines.some(inline => inline.type === type);
}

export const wrapInline = (editor: Editor, type: string, data?: any) => {
    editor.wrapInline({type,data});
    editor.moveToEnd();
};

    
export const unwrapInline = (editor: Editor, type: string,data?:any) => {
    if(hasInlineType(editor.value,type)){
        editor.unwrapInline({type,data});
    }
}


export const toggleInline = (editor:Editor, type:string, data?: any)=>{
    if(hasInlineType(editor.value,type)){
        unwrapInline(editor,type,data);
    }else{
        wrapInline(editor,type,data);
    }
}


/**
 * 
 * 
 *     onClickInline = (event: React.MouseEvent<HTMLSpanElement>, type: string, data: any) => {
        event.preventDefault();
        const value = this.props.content;
        const isActive = this.hasInlineType(type);
        const change = value.change();
        if (isActive) {
            //@ts-ignore
            change.call(unwrapInline, type, data);
        } else if (value.selection.isExpanded) {
            //@ts-ignore
            change.call(wrapInline, type, data);
        }
        this.props.onChange(change);
    }
 */ 



export default {
    hasInlineType,
    unwrapInline,
    wrapInline
}
