import { Plugin } from "slate-react";
import { Editor, Node } from "slate";
import uuid from 'uuid/v4';


export const generatePluginID = (pluginData: any)=>{
    return {
        ...pluginData,
        id: uuid()
    }
}