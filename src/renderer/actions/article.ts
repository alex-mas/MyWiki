
import { WikiMetadata } from "../store/reducers/wikis";
import * as uuid from 'uuid/v4';
import * as fsp from '../../utils/promisify-fs';
import * as path from 'path';
import { errorAction, fsError, ErrorAction, ErrorActionCode } from "./errors";
import { ValueJSON, Value } from "slate";
import { ActionWithPayload, AsyncACreator, ACreator } from "../../utils/typeUtils";
import { mlThreads } from "../services/ml";
import Plain from "slate-plain-serializer";


export const LOAD_ARTICLE = 'LOAD_ARTICLE';
export const DELETE_ARTICLE = 'DELETE_ARTICLE';
export const SAVE_ARTICLE = 'SAVE_ARTICLE';
export const CREATE_ARTICLE = 'CREATE_ARTICLE';
export const SET_ARTICLE_METADATA = 'SET_ARTICLE_METADATA';




export interface ArticleMetaData {
    name: string,
    tags: string[],
    keywords: string[],
    lastEdited: number,
    lastRead: number,
    category: ArticleCategory | string
    groups: string[]
}

export enum ArticleCategory {
    ARTICLE = 'article'
}
export type Article  = ArticleMetaData &{
    content: ValueJSON,
}


export type ArticleAction = ActionWithPayload<{
    article: ArticleMetaData,
    wiki: WikiMetadata
}>

export type ArticleACreator = ACreator<[ArticleMetaData, WikiMetadata],ArticleAction>;



export const getArticlePath = (wiki: WikiMetadata, articleName: string, category?: string) => {
    let basePath = path.join('./wikis', wiki.id);
    if(wiki.path){
        basePath = path.join(wiki.path);
    }
    basePath = path.join(basePath, 'articles');
    if(category && category !== ArticleCategory.ARTICLE){
        basePath = path.join(basePath,category);
    }
    return path.join(basePath, `${articleName}.json`);
}




export const getArticleMetaData = (article: Article): ArticleMetaData => {
    return {
        name: article.name,
        tags: article.tags,
        keywords: article.keywords,
        lastEdited: article.lastEdited,
        lastRead: article.lastRead,
        category: article.category,
        groups: article.groups
    }
}



export const setArticleMetaData = (metaData: ArticleMetaData)=>{
    return async(dispatch: any, getState: any)=>{
        
    }
}


export type CreateArticleActionCreator = AsyncACreator<[Article, WikiMetadata],ArticleAction, ArticleAction>;

const _createArticle: ArticleACreator = (article: ArticleMetaData, wiki: WikiMetadata) => {
    return {
        type: CREATE_ARTICLE,
        article,
        wiki
    }
}

export const createArticle: CreateArticleActionCreator = (article, wiki) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            generateArticleKeywords(article, wiki);
            await fsp.writeFile(
                getArticlePath(wiki, article.name),
                JSON.stringify(article),
                //fails if it exists
                {flag:'wx', encoding: 'utf8'}
            );
            return dispatch(_createArticle(getArticleMetaData(article),wiki));

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


export type LoadArticleActionCreator = AsyncACreator<[WikiMetadata,string,string,], ArticleAction, Article>;



const _loadArticle: ArticleACreator = (article: ArticleMetaData, wiki: WikiMetadata) => {
    return {
        type: LOAD_ARTICLE,
        article,
        wiki
    };
}



export const loadArticle: LoadArticleActionCreator = (wiki: WikiMetadata,name: string, category: string,) => {
    return async (dispatch, getState) => {
        const article: Article = {
            content: {},
            tags: [],
            name,
            keywords: [],
            groups: [],
            lastEdited: 0,
            lastRead: 0,
            category
        }
        let articleData;
        let filePath: string = getArticlePath(wiki, name);
        try{
            const data = await fsp.readFile(filePath, 'utf8');
            articleData = JSON.parse(data);
            if (typeof articleData.content === 'string') {
                article.content = JSON.parse(articleData.content);
            } else {
                article.content = articleData.content;
            }
            article.tags = articleData.tags;
            article.keywords = articleData.keywords;
            article.lastEdited = articleData.lastEdited ? articleData.lastEdited : Date.now();
            article.lastRead = articleData.lastRead ? articleData.lastRead : Date.now();
            dispatch(_loadArticle(getArticleMetaData(article),wiki))
            return article;
        }catch(e){
            console.warn(e);
            dispatch(fsError(`Error trying to fetch article ${name}, please try running the app as administrator. If that doesn't work contact the developer`));
            throw e;
        }
    }
}




export type SaveArticleActionCreator = AsyncACreator<[Article,WikiMetadata],ArticleAction>;


const _saveArticle: ArticleACreator = (article: ArticleMetaData,wiki: WikiMetadata) => {
    return {
        type: SAVE_ARTICLE,
        article,
        wiki
    };
}


export const saveArticle: SaveArticleActionCreator = (article: Article, wiki:WikiMetadata) => {
    return async(dispatch, getState) => {
        try{
            generateArticleKeywords(article,wiki);
            const p = fsp.writeFile(
                getArticlePath(wiki, article.name, article.category),
                JSON.stringify(article),
                'utf8'
            );
            dispatch(_saveArticle(getArticleMetaData(article),wiki));
            await p;
            return article;
        }catch(e){
            dispatch(fsError(`Error trying to edit article ${article.name}, please try running the app as administrator. If that doesn't work contact the developer`));
            throw e;
        }

    }
}




export type DeleteArticleAction = ActionWithPayload<{name: string}>;

export type DeleteArticleActionCreator = AsyncACreator<[string, WikiMetadata],DeleteArticleAction>;

export const deleteArticle: DeleteArticleActionCreator = (name: string, wiki: WikiMetadata) => {
    return async (dispatch, getState) => {
        let filePath = getArticlePath(wiki, name);
        try{
            await fsp.unlink(filePath);
            return dispatch({
                type: DELETE_ARTICLE,
                name,
                wiki
            });
        }catch(e){
            dispatch(fsError(`Error trying to delete article ${name}, please try running the app as administrator. If that doesn't work contact the developer`));
            throw e;
        }
    }
}



export const generateArticleKeywords = (article: Article, wiki: WikiMetadata)=>{
    mlThreads.sendMessage(
        {
            type: 'GET_KEYWORDS',
            name: article.name,
            wikiId: wiki.id,
            contents: Plain.serialize(Value.fromJSON(article.content) as any)
        }
    );
}