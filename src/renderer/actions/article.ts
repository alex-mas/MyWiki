
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


export interface ArticleMetaData {
    name: string,
    tags: string[],
    background: string
}
export interface Article {
    name: string,
    tags: string[],
    content: string,
    background: string
}

export interface ArticleAction extends Action {
    article: ArticleMetaData
}

export type CreateArticleAction = ArticleAction;

export type CreateArticleActionCreator = (article: Article) => ThunkAction<any, AppState, void, CreateArticleAction | ErrorAction>;


const _createArticle: ActionCreator<ArticleAction> = (article: Article) => {
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
            fs.access(path.join(wiki.path, 'wikis', 'articles', article.name), fs.constants.F_OK, (err) => {
                if (!err) {
                    const errMsg = fsError(`Wiki article named ${article.name} already exists, please rename or delete the existing article or change the name of this article`);
                    dispatch(errMsg);
                    reject(errMsg);
                } else {
                    fs.writeFile(
                        path.join(wiki.path, 'articles', `${article.name}.json`),
                        JSON.stringify(article),
                        'utf8',
                        (error) => {
                            if (error) {
                                const errMsg = fsError(`Error trying to create article ${article.name}, please try running the app as administrator. If that doesn't work contact the developer`);
                                dispatch(errMsg);
                                reject(errMsg);
                            } else {
                                dispatch(_createArticle(article))
                                resolve('Article succesfully creted');
                            }
                        }
                    );
                }
            })
        });
    }
}


export interface LoadArticleAction extends Action {
    article: Article
}

export type LoadArticleActionCreator = (name: string) => ThunkAction<any, AppState, void, LoadArticleAction | ErrorAction>;


export const loadArticle: LoadArticleActionCreator = (name: string) => {
    return (dispatch, getState) => {
        const selectedWiki = getState().selectedWiki;
        const article: Article = {
            content: '',
            tags: [],
            name,
            background: ''
        }
        return new Promise((resolve, reject) => {
            let articleData;
            let filePath;
            try {
                filePath = path.join(selectedWiki.path, 'articles', `${name}.json`);
                const fileContents = fs.readFileSync(filePath, 'utf8');
                articleData = JSON.parse(fileContents);
                console.log(articleData);
                if (articleData.content) {
                    article.content = articleData.content;
                    article.tags = articleData.tags;
                } else {
                    //in first versions of the app there was no tags so this keeps it backwards compatible with those wikis
                    article.content = fileContents;
                }
                dispatch({
                    type: 'LOAD_ARTICLE',
                    article
                })
                resolve(article);
            } catch (e) {
                fs.access(filePath, (error) => {
                    if (error) {
                        dispatch(fsError(`Error trying to fetch article ${name}, please try running the app as administrator. If that doesn't work contact the developer`));
                        reject(`error while trying to getch article ${name}\n ${error}`);
                    }
                });
            }
        });
    }
}


export interface SaveArticleAction extends Action {
    article: Article
}

export type SaveArticleActionCreator = (article: Article) => ThunkAction<any, AppState, void, SaveArticleAction | ErrorAction>;

export const saveArticle: SaveArticleActionCreator = (article: Article) => {
    return (dispatch, getState) => {
        const selectedWiki = getState().selectedWiki;
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(selectedWiki.path, 'articles', `${article.name}.json`),
                JSON.stringify(article),
                'utf8',
                (err) => {
                    if (err) {
                        dispatch(fsError(`Error trying to edit article ${article.name}, please try running the app as administrator. If that doesn't work contact the developer`));
                        reject(err);
                    } else {
                        dispatch({
                            type: 'SAVE_ARTICLE',
                            article
                        });
                        resolve()
                    }
                }
            );
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
            let filePath = path.join(selectedWiki.path, 'articles', `${name}.json`);
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