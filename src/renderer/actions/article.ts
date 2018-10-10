
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
    tags: string[]
}
export interface Article {
    name: string,
    tags: string[],
    content: string
}

export interface ArticleAction extends Action {
    article: ArticleMetaData
}

export type CreateArticleAction = ArticleAction;

export type CreateArticleActionCreator = (name: string, contents: string, tags: string[]) => ThunkAction<any, AppState, void, CreateArticleAction | ErrorAction>;


const _createArticle: ActionCreator<ArticleAction> = (name: string, tags: string[]) => {
    return {
        type: 'CREATE_ARTICLE',
        article: {
            name,
            tags
        }
    }
}

export const createArticle: CreateArticleActionCreator = (name: string, content: string, tags: string[]) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const state = getState();
            const wiki = state.selectedWiki;
            const article = {
                name,
                content,
                tags
            }
            fs.access(path.join(wiki.path, 'wikis', 'articles', name), fs.constants.F_OK, (err) => {
                if (!err) {
                    const errMsg = fsError(`Wiki article named ${name} already exists, please rename or delete the existing article or change the name of this article`);
                    dispatch(errMsg);
                    reject(errMsg);
                } else {
                    fs.writeFile(
                        path.join(wiki.path, 'articles', `${name}.json`),
                        JSON.stringify(article),
                        'utf8',
                        (error) => {
                            if (error) {
                                const errMsg = fsError(`Error trying to create article ${name}, please try running the app as administrator. If that doesn't work contact the developer`);
                                dispatch(errMsg);
                                reject(errMsg);
                            } else {
                                dispatch(_createArticle(article.name, article.tags))
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

export type LoadArticleActionCreator = (name: string) => ThunkAction<any, AppState, void, CreateArticleAction | ErrorAction>;


export const loadArticle: LoadArticleActionCreator = (name: string) => {
    return (dispatch, getState) => {
        const selectedWiki = getState().selectedWiki;
        const article: Article = {
            content: '',
            tags: [],
            name
        }
        return new Promise((resolve, reject) => {
            let articleData;
            let filePath;
            try {
                filePath = path.join(selectedWiki.path, 'articles', `${name}.json`);
                articleData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                console.log(articleData);
                article.content = articleData.content;
                article.tags = articleData.tags;
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
    article: ArticleMetaData
}

export type SaveArticleActionCreator = (name: string, tags: string[], content: string) => ThunkAction<any, AppState, void, CreateArticleAction | ErrorAction>;

export const saveArticle:  SaveArticleActionCreator = (name, tags, content)=>{
    return(dispatch,getState)=>{
        const selectedWiki = getState().selectedWiki;
        const article = {
            name,
            tags,
            content
        }
        return new Promise((resolve,reject)=>{
            fs.writeFile(
                path.join(selectedWiki.path, 'articles', `${name}.json`),
                JSON.stringify(article),
                'utf8',
                (err) => {
                    if (err) {
                        dispatch(fsError(`Error trying to edit article ${name}, please try running the app as administrator. If that doesn't work contact the developer`));
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
