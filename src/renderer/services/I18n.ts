import { AppState } from '../store/store';
import { AnyAction, Store } from 'redux';
import readOnly from '../../utils/readonly';
import ReduxService from '../../utils/reduxService';
import { I18N } from '../store/reducers/i18n';

export class ReduxI18N extends ReduxService<AppState>{
    traductions: I18N;
    constructor(store:Store<AppState>){
        super(store);
        this.traductions = store.getState().i18n;
    }
    initialize(){
        this.store.subscribe(()=>{
            const state = this.store.getState();
            if(this.traductions !== state.i18n){
                this.traductions = state.i18n;
            }
        });
    }
    traduce = (string:string)=>{
        const traduction = this.traductions[string];
        if(traduction){
            return traduction;
        }
        return string;
    }
}


export default ReduxI18N;