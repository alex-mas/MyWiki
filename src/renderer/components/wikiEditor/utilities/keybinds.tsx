import { Value, Editor } from "slate";



const isHotkey = (hotkey: string, event: React.KeyboardEvent<any>)=>{
    if(hotkey === event.key) {return true;}
    return false;
}

// @https://docs.slatejs.org/guides/plugins
export function Hotkey(hotkey: string, fn: (change: Value)=>any) {
    return {
      onKeyDown(event: React.KeyboardEvent<any>, change:Value, editor:Editor) {
        if (isHotkey(hotkey, event)) {
            //@ts-ignore
            change.call(fn)
        }
      },
    }
}

export default Hotkey;