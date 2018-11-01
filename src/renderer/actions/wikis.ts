import { ActionCreator, Dispatch, Action } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { error, fsError, ErrorAction, ErrorActionCodes } from "./errors";
import { deleteFolderRecursively } from '../utilities/fsutils';
import { Article, ArticleMetaData } from "./article";


type WikiAction = Action & { wiki: WikiMetaData };

export type CreateWikiAction = WikiAction;

export type UserWikiData = Pick<WikiMetaData, Exclude<keyof WikiMetaData, 'id' | 'path'>>;

export type CreateWikiActionCreator = (wiki: UserWikiData) => ThunkAction<any, AppState, void, CreateWikiAction | ErrorAction>;


export const createWiki: CreateWikiActionCreator = (wiki: UserWikiData) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const wikiId = uuid();
            const wikiPath = `./wikis/${wiki.name}(${wikiId})`;
            if (!fs.existsSync('./wikis')) {
                fs.mkdirSync('./wikis');
            }
     
            const wikiData: WikiMetaData = {
                path: wikiPath,
                name: wiki.name,
                id: wikiId,
                background: wiki.background,
                description: wiki.description
            }
            fs.mkdirSync(wikiPath);
            fs.mkdirSync(path.join(wikiPath, 'articles'));
            console.log(path.join(wikiPath, 'myWikiConfig.json'));
            fs.writeFile(path.join(wikiPath, 'myWiki.config.json'), JSON.stringify(wikiData), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                    const errMsg = fsError(`Error creating the configuration file for ${name} wiki`);
                    dispatch(errMsg);
                    reject(errMsg);
                } else {
                    dispatch({
                        type: 'CREATE_WIKI',
                        wiki: wikiData
                    });
                    //fs.writeFileSync(path.join(wikiPath, 'home.md'), fs.readFileSync(path.join('./', 'src/static/wikiHome.md')),'utf8');
                    //fs.writeFileSync(path.join(wikiPath, 'articles', 'test.md'), fs.readFileSync(path.join('./','src/static/testArticle.md')),'utf8');
                }
            });
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


export interface LoadWikiAction extends Action {
    wiki: WikiMetaData,
    articles: Article[]
}
export type LoadWikiActionCreator = (id: string) => ThunkAction<Promise<string>, AppState, void, LoadWikiAction | ErrorAction>;

export const loadWiki: LoadWikiActionCreator = (id: string) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const wiki = state.wikis.find((wiki) => wiki.id === id);
            const articles: Article[] = [];
            fs.readdir(`./wikis/${wiki.name}(${wiki.id})/articles`, (err, articleFiles: string[]) => {
                if (err) {
                    dispatch(fsError('error while reading articles folder'));
                    reject(err);
                } else {
                    try {
                        articleFiles.forEach((article) => {
                            const articleData: Article = JSON.parse(
                                fs.readFileSync(`./wikis/${wiki.name}(${wiki.id})/articles/${article}`, 'utf8')
                            );
                            articles.push(articleData);
                        });
                        console.log('load wiki payload: ', {
                            type: 'LOAD_WIKI',
                            wiki,
                            articles
                        });
                        dispatch({
                            type: 'LOAD_WIKI',
                            wiki,
                            articles
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