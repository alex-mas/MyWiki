
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
//@ts-ignore
import Plain from 'slate-plain-serializer';
import { ActionWithPayload, AsyncACreator, ACreator } from "./utils";
import { mlThreads, store } from "../app";
import { generateArticleKeywords } from "./ml";


export const LOAD_ARTICLE = 'LOAD_ARTICLE';
export const DELETE_ARTICLE = 'DELETE_ARTICLE';
export const SAVE_ARTICLE = 'SAVE_ARTICLE';
export const CREATE_ARTICLE = 'CREATE_ARTICLE';
export const SET_ARTICLE_METADATA = 'SET_ARTICLE_METADATA';




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




export const getArticleMetaData = (article: Article): ArticleMetaData => {
    return {
        name: article.name,
        tags: article.tags,
        background: article.background,
        keywords: article.keywords
    }
}



export const setArticleMetaData = (metaData: ArticleMetaData)=>{
    return async(dispatch: any, getState: any)=>{
        
    }
}


export type CreateArticleActionCreator = AsyncACreator<[Article],ArticleAction, ArticleAction>;

const _createArticle: ArticleACreator = (article: ArticleMetaData) => {
    return {
        type: CREATE_ARTICLE,
        article
    }
}

export const createArticle: CreateArticleActionCreator = (article) => {
    return async (dispatch, getState) => {
        const state = getState();
        const wiki = state.selectedWiki;
        try {
            generateArticleKeywords(article);
            await fsp.writeFile(
                getArticlePath(wiki, article.name),
                JSON.stringify(article),
                //fails if it exists
                {flag:'wx', encoding: 'utf8'}
            );
            return dispatch(_createArticle(getArticleMetaData(article)));

        } catch (e) {
            const errMsg = `Error trying to create article ${article.name}, 
            check that the article doesn't exist already, 
            else it might be a problem with the application\n ${e}`;
            //TODO: let the function return the return value of dispatch instead
           dispatch(fsError(errMsg));
           throw e;
        }
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
    return async (dispatch, getState) => {
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
            return article ;
        }catch(e){
            dispatch(fsError(`Error trying to fetch article ${name}, please try running the app as administrator. If that doesn't work contact the developer`));
            throw e;
        }
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
    return async(dispatch, getState) => {
        const selectedWiki = getState().selectedWiki;
        try{
            generateArticleKeywords(article);
            await fsp.writeFile(
                getArticlePath(selectedWiki, article.name),
                JSON.stringify(article),
                'utf8'
            );
            dispatch(_saveArticle(getArticleMetaData(article)));
            return article;
        }catch(e){
            dispatch(fsError(`Error trying to edit article ${article.name}, please try running the app as administrator. If that doesn't work contact the developer`));
            throw e;
        }

    }
}




export type DeleteArticleAction = ActionWithPayload<{name: string}>;

export type DeleteArticleActionCreator = AsyncACreator<[string],DeleteArticleAction>;

export const deleteArticle: DeleteArticleActionCreator = (name: string) => {
    return async (dispatch, getState) => {
        const selectedWiki = getState().selectedWiki;
        let filePath = getArticlePath(selectedWiki, name);
        try{
            await fsp.unlink(filePath);
            return dispatch({
                type: DELETE_ARTICLE,
                name
            });
        }catch(e){
            dispatch(fsError(`Error trying to delete article ${name}, please try running the app as administrator. If that doesn't work contact the developer`));
            throw e;
        }
    }
}