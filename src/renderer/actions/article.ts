
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


export interface Article {
    name: string,
    contents: JSON
}

type ArticleAction = Action & Article;

export type CreateArticleAction = ArticleAction;

export type CreateArticleActionCreator = (name: string, contents: JSON) => ThunkAction<any, AppState, void, CreateArticleAction | ErrorAction>;

export const createArticle: CreateArticleActionCreator = (name: string, contents: JSON) => {
    return (dispatch, getState) => {

    }

}