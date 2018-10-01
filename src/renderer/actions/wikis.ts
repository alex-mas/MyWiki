import { ActionCreator, Dispatch, Action } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as path from 'path';
import defaultWikiConfig from '../../shared/data/defaultWikiConfig.json';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { error, fsError, ErrorAction, ErrorActionCodes } from "./errors";
import { deleteFolderRecursively } from '../utilities/fsutils';


type WikiAction = Action & { wiki: WikiMetaData };

export type CreateWikiAction = WikiAction;

export type CreateWikiActionCreator = (name: string, wikiPath: string) => ThunkAction<any, AppState, void, CreateWikiAction | ErrorAction>;

export const createWiki: CreateWikiActionCreator = (name: string) => {
    return (dispatch, getState) => {
        const wikiId = uuid();
        const wikiPath = `./wikis/${name}(${wikiId})`;
        if (!fs.existsSync('./wikis')) {
            fs.mkdirSync('./wikis');
        }
        fs.mkdirSync(wikiPath);
        fs.mkdirSync(path.join(wikiPath, 'articles'));
        console.log(path.join(wikiPath, 'myWikiConfig.json'));
        fs.writeFile(path.join(wikiPath, 'myWikiConfig.json'), JSON.stringify(defaultWikiConfig), 'utf8', (error) => {
            if (error) {
                console.log(error);
                dispatch(fsError(`Error creating the configuration file for ${name} wiki`));
            } else {
                dispatch({
                    type: 'CREATE_WIKI',
                    wiki: {
                        path: wikiPath,
                        name,
                        id: wikiId
                    }
                });
                //fs.writeFileSync(path.join(wikiPath, 'home.md'), fs.readFileSync(path.join('./', 'src/static/wikiHome.md')),'utf8');
                //fs.writeFileSync(path.join(wikiPath, 'articles', 'test.md'), fs.readFileSync(path.join('./','src/static/testArticle.md')),'utf8');
            }
        });
    }

}

export type RemoveWikiAction = WikiAction;
export type RemoveWikiActionCreator = ActionCreator<ThunkAction<any, AppState, void, RemoveWikiAction | ErrorAction>>;

export const removeWiki: RemoveWikiActionCreator = (wiki: WikiMetaData) => {
    return (dispatch, getState) => {
        try {
            fs.readdir('./wikis', (err, wikis) => {
                wikis.forEach((wikiFolder) => {
                    if (wikiFolder === `${wiki.name}(${wiki.id})`) {
                        deleteFolderRecursively(path.join('./wikis', `${wiki.name}(${wiki.id})`));
                    }
                });
            });
        } catch (e) {
            return dispatch(fsError('error removing wiki folder'));
        }
        return dispatch({
            type: 'REMOVE_WIKI',
            wiki
        });
    }
}


export type SelectWikiAction = WikiAction;
export type SelectWikiActionCreator = ActionCreator<ThunkAction<any, AppState, void, SelectWikiAction | ErrorAction>>;

export const selectWiki: SelectWikiActionCreator = (id: string) => {
    return (dispatch, getState) => {
        const state = getState();
        const wiki = state.wikis.find((wiki) => wiki.id === id);
        if (wiki) {
            dispatch({
                type: 'SELECT_WIKI',
                wiki
            });
        } else {
            dispatch(error(`Wiki id (${id}) provided doesn't mach with any of the wikis tracked by the app`, ErrorActionCodes.WRONG_PARAMS));
        }
    }

}


export const loadWikis: ActionCreator<{ wikis: WikiMetaData[] } & Action> = (wikis: WikiMetaData[]) => {
    return {
        type: 'LOAD_WIKIS',
        wikis
    }
}



export default {
    createWiki,
    removeWiki,
    loadWikis
}