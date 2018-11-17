import { ActionCreator, Dispatch, Action } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as fsp from '../../utils/promisify-fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { errorAction, fsError, ErrorAction, ErrorActionCode } from "./errors";
import { deleteFolderRecursively } from '../../utils/fsutils';
import { Article, ArticleMetaData, getArticleMetaData } from "./article";
import { ActionWithPayload, AsyncACreator, ACreator } from "../../utils/typeUtils";
import { store } from "../app";


export const CREATE_WIKI = 'CREATE_WIKI';
export const REMOVE_WIKI = 'REMOVE_WIKI';
export const SELECT_WIKI = 'SELECT_WIKI';
export const LOAD_WIKI = 'LOAD_WIKI';
export const LOAD_WIKIS = 'LOAD_WIKIS';
export const RESET_WIKI = 'RESET_WIKI';
export const  SET_WIKI_BACKGROUND = 'SET_WIKI_BACKGROUND';
export const SET_WIKI_NAME = 'SET_WIKI_NAME';
export const SET_WIKI_DESCRIPTION = 'SET_WIKI_DESCRIPTION';
export const SET_WIKI_DATA = 'SET_WIKI_DATA';


type WikiAction = Action & { wiki: WikiMetaData };

export type CreateWikiAction = WikiAction;

export type UserWikiData = Pick<WikiMetaData, Exclude<keyof WikiMetaData, 'id' | 'path' | 'articles'>>;

export type CreateWikiActionCreator = (wiki: UserWikiData) => ThunkAction<any, AppState, void, CreateWikiAction | ErrorAction>;


const _createWiki = (wiki: WikiMetaData) => {
    return {
        type: CREATE_WIKI,
        wiki
    }
};


export const createWiki: CreateWikiActionCreator = (wiki: UserWikiData) => {
    return async(dispatch, getState) => {
        const wikiId = uuid();
        const wikiPath = `./wikis/${wikiId}`;
        try {
            await fsp.mkdir('./wikis').catch((e) => console.log(e));
            const wikiData: WikiMetaData = {
                path: wikiPath,
                name: wiki.name,
                id: wikiId,
                background: wiki.background,
                description: wiki.description,
                articles: []
            }
            await fsp.mkdir(wikiPath);
            await fsp.mkdir(path.join(wikiPath, 'articles'));
            await fsp.writeFile(
                path.join(wikiPath, 'myWiki.config.json'),
                JSON.stringify(wikiData),
                'utf8'
            );
            return dispatch(_createWiki(wikiData));

        } catch (error) {
            console.log(error);
            const errMsg = fsError(`Error creating the configuration file for ${name} wiki`);
            dispatch(errMsg);
            throw error;
        }
    }

}

export type RemoveWikiAction = WikiAction;
export type RemoveWikiActionCreator = ActionCreator<ThunkAction<any, AppState, void, RemoveWikiAction | ErrorAction>>;

export const removeWiki: RemoveWikiActionCreator = (wiki: WikiMetaData) => {
    return async(dispatch, getState) => {
        try {
            const wikis = await fsp.readdir('./wikis');
            wikis.forEach((wikiFolder) => {
                if (wikiFolder === wiki.id) {
                    deleteFolderRecursively(path.join('./wikis', `${wiki.id}`));
                }
            });
        } catch (e) {
            dispatch(fsError('error removing wiki folder'));
            throw e;
        } finally {
            return dispatch({
                type: REMOVE_WIKI,
                wiki
            });
        }
    }
}


export type SelectWikiAction = WikiAction;
export type SelectWikiActionCreator = ActionCreator<ThunkAction<any, AppState, void, SelectWikiAction | ErrorAction>>;

export const selectWiki: SelectWikiActionCreator = (id: string) => {
    return async(dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const wiki = state.wikis.find((wiki) => wiki.id === id);
            if (wiki) {
                resolve(dispatch({
                    type: SELECT_WIKI,
                    wiki
                }));
            } else {
                reject(dispatch(errorAction(`Wiki id (${id}) provided doesn't mach with any of the wikis tracked by the app`, ErrorActionCode.WRONG_PARAMS)));
            }
        })

    }
}


export type LoadWikiAction = ActionWithPayload<{
    wiki: WikiMetaData
}>;
export type LoadWikiActionCreator = AsyncACreator<[string], LoadWikiAction>;

export const loadWiki: LoadWikiActionCreator = (id: string) => {
    return async (dispatch, getState) => {
        try {
            const wiki = JSON.parse(await fsp.readFile(`./wikis/${id}/myWiki.config.json`, 'utf8'));
            const articleFiles = await fsp.readdir(`./wikis/${id}/articles`);
            const articles = await Promise.all(articleFiles.map(async (articleFile) => {
                const articleContents = await fsp.readFile(`./wikis/${id}/articles/${articleFile}`, 'utf8');
                const article: Article = JSON.parse(articleContents);
                delete article.content;
                return article as ArticleMetaData;
            }))
            .catch((e)=>{
                dispatch(fsError('error while reading articles'));
                throw e;
            });
            return dispatch({
                type: LOAD_WIKI,
                wiki: {
                    ...wiki,
                    articles
                }
            });
        } catch (err) {
            dispatch(fsError('error while reading articles folder'));
            throw err;
        }
    }
}



export type SetWikiBgAction =ActionWithPayload<{background:string}>;
export type SetWikiBgActionCreator =ACreator<[string,string], SetWikiBgAction>
export const setWikiBackground: SetWikiBgActionCreator = (id: string,background: string)=>{
    return {
        type: SET_WIKI_BACKGROUND,
        id,
        background
    }
}



export type SetWikiNameAction =ActionWithPayload<{name:string}>;
export type SetWikiNameActionCreator =ACreator<[string,string], SetWikiNameAction>
export const setWikiName: SetWikiNameActionCreator = (id: string, name: string)=>{
    return {
        type: SET_WIKI_NAME,
        id,
        name
    }
}


export type SetWikiDescriptionAction =ActionWithPayload<{description: string}>;
export type SetWikiDescriptionActionCreator =ACreator<[string,string], SetWikiDescriptionAction>
export const setWikiDescription: SetWikiDescriptionActionCreator = (id: string, description: string)=>{
    return {
        type: SET_WIKI_DESCRIPTION,
        id,
        description
      
    }
}



export type LoadWikisAction = Action<string>;
export type LoadWikisActionCreator = AsyncACreator<any, LoadWikisAction, void>;

export const loadWikis: LoadWikisActionCreator = ()=>{
    return async(dispatch, getState)=>{
        try {
            const files = await fsp.readdir('./wikis');
            files.forEach(async (file) => {
                try {
                    //@ts-ignore
                    dispatch(loadWiki(file));
                } catch (e) {
                    dispatch(fsError('Error while parsing wiki meta data'));
                }
            });
        } catch (e) {
            dispatch(fsError('Error loading wiki meta-data'));
            throw e;
        }
    }
}



export type SaveWikisAction = Action<string>;
export type SaveWikisActionCreator = AsyncACreator<any, SaveWikisAction, void>;


export const saveWikis = ()=>{
    const wikis = store.getState().wikis;
    wikis.forEach(async (wiki, index) => {
        if (wiki) {
            try {
                fsp.writeFile(`./wikis/${wiki.id}/myWiki.config.json`, JSON.stringify(wiki), 'utf8');
            } catch (e) {
                store.dispatch(fsError('Error saving wiki configuration files'));
                throw e;
            }
        }
    });
}





export default {
    createWiki,
    removeWiki,
    loadWiki,
    loadWikis
}