
import { WikiMetadata } from "../store/reducers/wikis";
import { memo } from "react";
import memoize from "../../utils/memoize";


/**
 * reduces the array of articles to an array of article names
 * 
 */
export const getArticleNames = (wiki: WikiMetadata): string[]=>{
    return wiki.articles.map((article)=>{
        return article.name;
    });
};

//TODO: add further parsing
const parseSearch = (rawSerach: string)=>{
    return rawSerach.toLocaleLowerCase();
}

/**
 * 
 * v1 of article search -> we check for a partial match on article names or an exact match of any of its tags.
 * 
 * 
 */
export const getRelevantArticles= (wiki: WikiMetadata, search:string = ""): string[]=>{
    const parsedSearch = parseSearch(search);
    const regularMatches = wiki.articles.filter((article)=>{
        if(
            article.name.toLocaleLowerCase().includes(search) ||
            (article.tags && article.tags.indexOf(search) > -1) ||
            (article.keywords && article.keywords.indexOf(search) > -1)
        ){
            return true;
        }else{
            return false;
        }
    }).map((article)=>article.name);
    
    return regularMatches;
}


export const getArticle = (name:string, wiki: WikiMetadata)=>{
    return wiki.articles.find((article)=>article.name === name);
}

export const doesArticleExist = (name:string, wiki: WikiMetadata)=>{
    //cast results to a boolean
    return !!getArticle(name, wiki);
}


export const getLastEditedArticles = (wiki: WikiMetadata, count: number = 5)=>{
    if(!wiki){
        return [];
    }
    const sorted = wiki.articles.sort((a,b)=>b.lastEdited-a.lastEdited);
    return sorted.slice(0,count);
}

export const getLastViewedArticles = (wiki: WikiMetadata, count: number = 5)=>{
    if(!wiki){
        return [];
    }
    const sorted = wiki.articles.sort((a,b)=>b.lastRead-a.lastRead);
    return sorted.slice(0,count);
}