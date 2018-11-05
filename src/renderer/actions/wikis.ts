import { ActionCreator, Dispatch, Action } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as fsp from '../../utils/promisify-fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { errorAction, fsError, ErrorAction, ErrorActionCodes } from "./errors";
import { deleteFolderRecursively } from '../utilities/fsutils';
import { Article, ArticleMetaData, getArticleMetaData } from "./article";


type WikiAction = Action & { wiki: WikiMetaData };

export type CreateWikiAction = WikiAction;

export type UserWikiData = Pick<WikiMetaData, Exclude<keyof WikiMetaData, 'id' | 'path' | 'articles'>>;

export type CreateWikiActionCreator = (wiki: UserWikiData) => ThunkAction<any, AppState, void, CreateWikiAction | ErrorAction>;


export const createWiki: CreateWikiActionCreator = (wiki: UserWikiData) => {
    return (dispatch, getState) => {
        return new Promise(async(resolve, reject) => {
            const wikiId = uuid();
            const wikiPath = `./wikis/${wikiId}`;
            try{
                await fsp.mkdir('./wikis').catch((e)=>console.log(e));
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
                dispatch({
                    type: 'CREATE_WIKI',
                    wiki: wikiData
                });

            }catch(error){
                console.log(error);
                const errMsg = fsError(`Error creating the configuration file for ${name} wiki`);
                dispatch(errMsg);
                reject(errMsg);
            }
        });
    }

}

export type RemoveWikiAction = WikiAction;
export type RemoveWikiActionCreator = ActionCreator<ThunkAction<any, AppState, void, RemoveWikiAction | ErrorAction>>;

export const removeWiki: RemoveWikiActionCreator = (wiki: WikiMetaData) => {
    return (dispatch, getState) => {
        return new Promise(async(resolve,reject)=>{
            try {
                const wikis = await fsp.readdir('./wikis');
                wikis.forEach((wikiFolder) => {
                    if (wikiFolder === wiki.id) {
                        deleteFolderRecursively(path.join('./wikis', `${wiki.id}`));
                    }
                });
            } catch (e) {
                reject(dispatch(fsError('error removing wiki folder')));
            }finally{
                resolve(dispatch({
                    type: 'REMOVE_WIKI',
                    wiki
                }));
            }
   
        });
    }
}


export type SelectWikiAction = WikiAction;
export type SelectWikiActionCreator = ActionCreator<ThunkAction<any, AppState, void, SelectWikiAction | ErrorAction>>;

export const selectWiki: SelectWikiActionCreator = (id: string) => {
    return (dispatch, getState) => {
        return new Promise((resolve,reject)=>{
            const state = getState();
            const wiki = state.wikis.find((wiki) => wiki.id === id);
            if (wiki) {
                resolve(dispatch({
                    type: 'SELECT_WIKI',
                    wiki
                }));
            } else {
                reject(dispatch(errorAction(`Wiki id (${id}) provided doesn't mach with any of the wikis tracked by the app`, ErrorActionCodes.WRONG_PARAMS)));
            }
        })

    }
}


export interface LoadWikiAction extends Action {
    wiki: WikiMetaData
}
export type LoadWikiActionCreator = (id: string) => ThunkAction<Promise<string>, AppState, void, LoadWikiAction | ErrorAction>;

export const loadWiki: LoadWikiActionCreator = (id: string) => {
    return (dispatch, getState) => {
        return new Promise(async (resolve, reject) => {
            /*try{
                const state = getState();
                const wiki = JSON.parse(await fsp.readFile(`./wikis/${id}/myWiki.config.json`, 'utf8'));
                const articleFiles = await fsp.readdir(`./wikis/${id}/articles`);
        
                const articles = articleFiles.map();
            }catch(e){

            }*/
            const state = getState();
            const wiki = JSON.parse(fs.readFileSync(`./wikis/${id}/myWiki.config.json`, 'utf8'));
            const articles: ArticleMetaData[] = [];
            fs.readdir(`./wikis/${id}/articles`, (err, articleFiles: string[]) => {
                if (err) {
                    dispatch(fsError('error while reading articles folder'));
                    reject(err);
                } else {
                    try {
                        articleFiles.forEach((articleName) => {
                            const article: Article = JSON.parse(
                                fs.readFileSync(`./wikis/${id}/articles/${articleName}`, 'utf8')
                            );
                            const articleData = getArticleMetaData(article);
                            articles.push(articleData);
                        });
                        console.log('load wiki payload: ', {
                            type: 'LOAD_WIKI',
                            wiki: {
                                ...wiki,
                                articles
                            }
                        });
                        dispatch({
                            type: 'LOAD_WIKI',
                            wiki: {
                                ...wiki,
                                articles
                            }
                        });
                        resolve('success loading wiki');
                    } catch (e) {
                        dispatch(fsError('error while reading aeticles'));
                        reject(e);
                    }
                }
            });

        });
    }
}


export type LoadWikisAction = { wikis: WikiMetaData[] } & Action;
export type LoadWikisActionCreator = ActionCreator<LoadWikisAction>

export const loadWikis: LoadWikisActionCreator = (wikis: WikiMetaData[]) => {
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