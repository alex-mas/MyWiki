import AppStore from "../store/store";

export const createTranslator = (appStore: AppStore)=>{
    return (toTranslate: string)=>{
        const translated = appStore.get().getState().i18n[toTranslate];
        if(translated){
            return translated;
        }else{
            return toTranslate;
        }
    }
}
