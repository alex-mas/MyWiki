import { Value, MarkProperties, Change } from "slate";
import { RenderMarkProps } from "slate-react";



export const hasInlineType = (content: Value, type: string) => {
    return content.inlines.some(inline => inline.type === type);
}

export const wrapInline = (change: Change, type: string, data?: any) => {
    change.wrapInline({
        type,
        data: data ? data : {}
    });
    change.moveToEnd();
};


export const unwrapInline = (change: Change, type: string) => {
    change.unwrapInline(type);
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


export const  wrapLink = (change: Change, href: string, isOutLink: boolean = false) => {
    console.log('Href: ', href);
    change.wrapInline({
        type: 'link',
        data: { href, isOutLink }
    });
    change.moveToEnd()
}



export const unwrapLink =(change: Change)=> {
    change.unwrapInline('link')
}

export default {
    hasInlineType,
    unwrapLink,
    unwrapInline,
    wrapInline,
    wrapLink
}
