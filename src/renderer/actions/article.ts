
import { ActionCreator, Dispatch, Action, AnyAction } from "redux";
import { WikiMetaData } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fs from 'fs';
import * as path from 'path';
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store/store";
import { error as errorActionCreator, fsError, ErrorAction, ErrorActionCodes } from "./errors";
import { deleteFolderRecursively } from '../utilities/fsutils';
import { ValueJSON, Value } from "slate";
import { ipcRenderer } from "electron";
import * as child_process from 'child_process';
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


export const getArticlePath = (wiki: WikiMetaData, articleName: string)=>{
    return path.join('./wikis',wiki.id, 'articles',`${articleName}.json`);
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
        return new Promise((resolve, reject) => {
            const state = getState();
            const wiki = state.selectedWiki;
            fs.access(getArticlePath(wiki,article.name), fs.constants.F_OK, (err) => {
                if (!err) {
                    const errMsg = fsError(`Wiki article named ${article.name} already exists, please rename or delete the existing article or change the name of this article`);
                    dispatch(errMsg);
                    reject(errMsg);
                } else {
                    getArticleKeywords(article)
                        .then((keywords) => {
                            const enhancedArticle = {
                                ...article,
                                keywords
                            }
                            fs.writeFile(
                                getArticlePath(wiki, article.name),
                                JSON.stringify(enhancedArticle),
                                'utf8',
                                (error) => {
                                    if (error) {
                                        const errMsg = fsError(`Error trying to create article ${article.name}, please try running the app as administrator. If that doesn't work contact the developer`);
                                        dispatch(errMsg);
                                        reject(errMsg);
                                    } else {
                                        dispatch(_createArticle(getArticleMetaData(article)))
                                        resolve(enhancedArticle);
                                    }
                                }
                            );
                        }).catch((e)=>console.warn('error getting keywords',e));

                }
            })
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
        const selectedWiki = getState().selectedWiki;
        const article: Article = {
            content: {},
            tags: [],
            name,
            background: '',
            keywords: []
        }
        return new Promise((resolve, reject) => {
            let articleData;
            let filePath: string;
            filePath = getArticlePath(selectedWiki,name);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    fs.access(filePath, (error) => {
                        if (error) {
                            dispatch(fsError(`Error trying to fetch article ${name}, please try running the app as administrator. If that doesn't work contact the developer`));
                            reject(`error while trying to fetch article ${name}\n ${error}`);
                        }
                    });
                }
                articleData = JSON.parse(data);
                console.log(articleData);
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
            });
        });
    }
}


export interface SaveArticleAction extends Action {
    article: Article
}

export type SaveArticleActionCreator = (article: Article) => ThunkAction<any, AppState, void, SaveArticleAction | ErrorAction>;


const _saveArticle: ActionCreator<ArticleAction> = (article: ArticleMetaData) => {
    return {
        type: 'SAVE_ARTICLE',
        article
    };
}


export const saveArticle: SaveArticleActionCreator = (article: Article) => {
    return (dispatch, getState) => {
        const selectedWiki = getState().selectedWiki;
        return new Promise((resolve, reject) => {
            getArticleKeywords(article)
                .then((keywords) => {
                    const enhancedArticle = {
                        ...article,
                        keywords
                    };
                    fs.writeFile(
                        getArticlePath(selectedWiki, article.name),
                        JSON.stringify(enhancedArticle),
                        'utf8',
                        (err) => {
                            if (err) {
                                dispatch(fsError(`Error trying to edit article ${article.name}, please try running the app as administrator. If that doesn't work contact the developer`));
                                reject(err);
                            } else {
                                dispatch(_saveArticle);
                                resolve(enhancedArticle);
                            }
                        }
                    );
                });
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
        return new Promise((resolve, reject) => {
            let filePath = getArticlePath(selectedWiki, name);
            fs.unlink(filePath, (error) => {
                if (error) {
                    dispatch(fsError(`Error trying to delete article ${name}, please try running the app as administrator. If that doesn't work contact the developer`))
                    reject(error);
                } else {
                    dispatch({
                        type: 'DELETE_ARTICLE',
                        name
                    });
                    resolve();
                }
            });
        });
    }
}