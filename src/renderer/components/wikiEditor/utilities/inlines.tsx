import { Value, MarkProperties, Editor } from "slate";
import { RenderMarkProps } from "slate-react";



export const hasInlineType = (content: Value, type: string) => {
    return content.inlines.some(inline => inline.type === type);
}
  
export const wrapInline = (editor: Editor, type: string, data?: any) => {
    editor.wrapInline({
        type,
        data: data ? data : {}
    });
    editor.moveToEnd();
};

    
export const unwrapInline = (editor: Editor, type: string) => {
    editor.unwrapInline(type);
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
