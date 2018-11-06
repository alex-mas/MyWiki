
import { ActionCreator, Dispatch, Action, AnyAction } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as fsp from '../../utils/promisify-fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { errorAction, fsError, ErrorAction, ErrorActionCode } from "./errors";
import { deleteFolderRecursively } from '../utilities/fsutils';
import { ValueJSON, Value } from "slate";
import { ipcRenderer } from "electron";
import * as child_process from 'child_process';

import Plain from 'slate-plain-serializer';
import { ActionWithPayload, AsyncACreator, ACreator } from "./utils";


export const LOAD_ARTICLE = 'LOAD_ARTICLE';
export const DELETE_ARTICLE = 'DELETE_ARTICLE';
export const SAVE_ARTICLE = 'SAVE_ARTICLE';
export const CREATE_ARTICLE = 'CREATE_ARTICLE';



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


export type ArticleAction = ActionWithPayload<{
    article: ArticleMetaData
}>

export type ArticleACreator = ACreator<[ArticleMetaData],ArticleAction>;



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





export type CreateArticleActionCreator = AsyncACreator<[Article],any,ArticleAction>;

const _createArticle: ArticleACreator = (article: ArticleMetaData) => {
    return {
        type: CREATE_ARTICLE,
        article
    }
}

export const createArticle: CreateArticleActionCreator = (article) => {
    return (dispatch, getState) => {
        return new Promise(async () => {
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
                return enhancedArticle;

            } catch (e) {
                const errMsg = `Error trying to create article ${article.name}, 
                check that the article doesn't exist already, 
                else it might be a problem with the application\n ${e}`;
                return dispatch(fsError(errMsg));
            }
        });
    }
}




export type LoadArticleActionCreator = AsyncACreator<[string], ArticleAction, Article>;



const _loadArticle: ArticleACreator = (article: ArticleMetaData) => {
    return {
        type: LOAD_ARTICLE,
        article
    };
}



export const loadArticle: LoadArticleActionCreator = (name: string) => {
    return (dispatch, getState) => {
        return new Promise(async (resolve, reject) => {
            const wiki = getState().selectedWiki;
            const article: Article = {
                content: {},
                tags: [],
                name,
                background: '',
                keywords: []
            }
            let articleData;
            let filePath: string = getArticlePath(wiki, name);
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




export type SaveArticleActionCreator = AsyncACreator<[Article],ArticleAction>;


const _saveArticle: ArticleACreator = (article: ArticleMetaData) => {
    return {
        type: SAVE_ARTICLE,
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




export type DeleteArticleAction = ActionWithPayload<{name: string}>;

export type DeleteArticleActionCreator = AsyncACreator<[string],DeleteArticleAction>;

export const deleteArticle: DeleteArticleActionCreator = (name: string) => {
    return (dispatch, getState) => {
        const selectedWiki = getState().selectedWiki;
        return new Promise(async (resolve, reject) => {
            let filePath = getArticlePath(selectedWiki, name);
            try{
                await fsp.unlink(filePath);
                resolve(dispatch({
                    type: DELETE_ARTICLE,
                    name
                }));
            }catch(e){
                dispatch(fsError(`Error trying to delete article ${name}, please try running the app as administrator. If that doesn't work contact the developer`))
                reject(e);
            }
        });
    }
}