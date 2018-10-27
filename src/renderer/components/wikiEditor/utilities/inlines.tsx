import { Value, MarkProperties } from "slate";
import { RenderMarkProps } from "slate-react";



export const hasInlineType = (content: Value, type: string) => {
    return content.inlines.some(inline => inline.type === type);
}



export default {
    hasInlineType
}
