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
            const i18n = this.store.getState().i18n;
            if (this.traductions !== i18n) {
                this.traductions = readOnly(i18n);
            }
        });
    }
    public traduce = (string: string) => {
        const traduction = this.traductions[string];
        console.log(`translating ${string} to ${traduction}`);
        if (traduction) {
            return traduction;
        }
        return string;
    }
}


export default ReduxI18NService;