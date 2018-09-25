import { Reducer, AnyAction } from "redux";
import { WikiMetaData } from "./wikis";

export interface SelectedWiki extends WikiMetaData {

}


const defaultState: SelectedWiki = {
    path: '',
    name: '',
    id: ''
};

export const SelectedWikiReducer: Reducer<SelectedWiki> = (state: SelectedWiki = defaultState, action: AnyAction) => {
    switch (action.type) {
        case 'SELECT_WIKI':
            return {
                ...action.wiki
            };
        default:
            return state;
    }
}

export default SelectedWikiReducer;