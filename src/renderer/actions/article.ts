
import { ActionCreator, Dispatch, Action, AnyAction } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as fsp from '../../utils/promisify-fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { errorAction, fsError, ErrorAction, ErrorActionCodes } from "./errors";
import { deleteFolderRecursively } from '../utilities/fsutils';
import { ValueJSON, Value } from "slate";
import { ipcRenderer } from "electron";
import * as child_process from 'child_process';
//@ts-ignore
import Plain from 'slate-plain-serializer';


export interface ArticleMetaData {
    name: string,
    tags: string[],
    keywords: string[],
    background: string
}
export interface Article {
    name: string,
    tags: string[],
    content: ValueJSON,
    background: string,
    keywords: string[]
}


export const getArticlePath = (wiki: WikiMetaData, articleName: string) => {
    return path.join('./wikis', wiki.id, 'articles', `${articleName}.json`);
}

export const getArticleKeywords = (article: Article): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        resolve([]);
    });
}

export const getArticleMetaData = (article: Article): ArticleMetaData => {
    return {
        name: article.name,
        tags: article.tags,
        background: article.background,
        keywords: article.keywords
    }
}



export interface ArticleAction extends Action {
    article: ArticleMetaData
}

export type CreateArticleAction = ArticleAction;

export type CreateArticleActionCreator = (article: Article) => ThunkAction<any, AppState, void, CreateArticleAction | ErrorAction>;


const _createArticle: ActionCreator<ArticleAction> = (article: ArticleMetaData) => {
    return {
        type: 'CREATE_ARTICLE',
        article
    }
}

export const createArticle: CreateArticleActionCreator = (article: Article) => {
    return (dispatch, getState) => {
        return new Promise(async (resolve, reject) => {
            const state = getState();
            const wiki = state.selectedWiki;
            try {
                const keywords = await getArticleKeywords(article);
                const enhancedArticle: Article = {
                    ...article,
                    keywords
                }
                await fsp.writeFile(
                    getArticlePath(wiki, article.name),
                    JSON.stringify(enhancedArticle),
                    //fails if it exists
                    {flag:'wx', encoding: 'utf8'}
                );
                dispatch(_createArticle(getArticleMetaData(enhancedArticle)));
                resolve(enhancedArticle);

            } catch (e) {
                //TODO: 
                const errMsg = `Error trying to create article ${article.name}, 
                check that the article doesn't exist already, 
                else it might be a problem with the application\n ${e}`;
                dispatch(fsError(errMsg));
            }
        });
    }
}




export type LoadArticleActionCreator = (name: string) => ThunkAction<Promise<Article>, AppState, void, ArticleAction | ErrorAction>;



const _loadArticle: ActionCreator<ArticleAction> = (article: ArticleMetaData) => {
    return {
        type: 'LOAD_ARTICLE',
        article
    };
}



export const loadArticle: LoadArticleActionCreator = (name: string) => {
    return (dispatch, getState) => {
        return new Promise(async (resolve, reject) => {
            const selectedWiki = getState().selectedWiki;
            const article: Article = {
                content: {},
                tags: [],
                name,
                background: '',
                keywords: []
            }
            let articleData;
            let filePath: string = getArticlePath(selectedWiki, name);
            try{
                const data = await fsp.readFile(filePath, 'utf8');
                articleData = JSON.parse(data);
                if (articleData.content) {
                    if (typeof articleData.content === 'string') {
                        article.content = JSON.parse(articleData.content);
                    } else {
                        article.content = articleData.content;
                    }
                    article.tags = articleData.tags;
                } else {
                    //in first versions of the app there was no tags so this keeps it backwards compatible with those wikis
                    article.content = JSON.parse(data);
                }
                dispatch(_loadArticle(getArticleMetaData(article)))
                resolve(article);
            }catch(e){
                dispatch(fsError(`Error trying to fetch article ${name}, please try running the app as administrator. If that doesn't work contact the developer`));
                reject(`error while trying to fetch article ${name}\n ${e}`);
            }
    
        });
    }
}


export interface SaveArticleAction extends Action {
    article: ArticleMetaData
}

export type SaveArticleActionCreator = (article: Article) => ThunkAction<Promise<Article>, AppState, void, SaveArticleAction | ErrorAction>;


const _saveArticle: ActionCreator<ArticleAction> = (article: ArticleMetaData) => {
    return {
        type: 'SAVE_ARTICLE',
        article
    };
}


export const saveArticle: SaveArticleActionCreator = (article: Article) => {
    return (dispatch, getState) => {
        const selectedWiki = getState().selectedWiki;
        return new Promise(async (resolve, reject) => {
            try{
                const keywords = await getArticleKeywords(article);
                const enhancedArticle = {
                    ...article,
                    keywords
                };
                await fsp.writeFile(
                    getArticlePath(selectedWiki, article.name),
                    JSON.stringify(enhancedArticle),
                    'utf8'
                );
                dispatch(_saveArticle(getArticleMetaData(enhancedArticle)));
                resolve(enhancedArticle);
            }catch(e){
                dispatch(fsError(`Error trying to edit article ${article.name}, please try running the app as administrator. If that doesn't work contact the developer`));
                reject(e);
            }
        });
    }
}




export interface DeleteArticleAction extends Action {
    name: string
}

export type DeleteArticleActionCreator = (name: string) => ThunkAction<any, AppState, void, DeleteArticleAction | ErrorAction>;

export const deleteArticle: DeleteArticleActionCreator = (name: string) => {
    return (dispatch, getState) => {
        const selectedWiki = getState().selectedWiki;
        return new Promise(async (resolve, reject) => {
            let filePath = getArticlePath(selectedWiki, name);
            try{
                await fsp.unlink(filePath);
                resolve(dispatch({
                    type: 'DELETE_ARTICLE',
                    name
                }));
            }catch(e){
                dispatch(fsError(`Error trying to delete article ${name}, please try running the app as administrator. If that doesn't work contact the developer`))
                reject(e);
            }
        });
    }
}