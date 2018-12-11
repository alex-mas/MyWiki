import AppStore,{AppState}  from '../store/store';
import { AnyAction, Store } from 'redux';
import readOnly from '../../utils/readonly';
import ReduxService from '../../utils/reduxService';
import { I18N } from '../store/reducers/i18n';

export class ReduxI18NService extends ReduxService<AppState>{
    private traductions: I18N;
    constructor(store: AppStore) {
        super(store.get());
        this.traductions = readOnly(store.get().getState().i18n);
        this.store.subscribe(() => {
            const state = this.store.getState();
            if (this.traductions !== state.i18n) {
                this.traductions = readOnly(state.i18n);
            }
        });
    }
    public traduce = (string: string) => {
        const traduction = this.traductions[string];
        if (traduction) {
            return traduction;
        }
        return string;
    }
}


export default ReduxI18NService;