import { Value, Editor } from "slate";



const isHotkey = (hotkey: string, event: React.KeyboardEvent<any>)=>{
    if(hotkey === event.key) {return true;}
    return false;
}

// @https://docs.slatejs.org/guides/plugins
export function Hotkey(hotkey: string, fn: (editor: Editor)=>any) {
    return {
      onKeyDown(event: React.KeyboardEvent<any>, editor:Editor, next: Function) {
        if (isHotkey(hotkey, event)) {
            fn(editor);
        }
        next();
      },
    }
}

export default Hotkey;