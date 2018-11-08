
import { WikiMetaData } from "../store/reducers/wikis";


/**
 * reduces the array of articles to an array of article names
 * 
 */
export const getArticleNames = (selectedWiki: WikiMetaData): string[]=>{
    return selectedWiki.articles.map((article)=>{
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
export const getRelevantArticles= (search:string, selectedWiki: WikiMetaData): string[]=>{
    const parsedSearch = parseSearch(search);
    const regularMatches = selectedWiki.articles.filter((article)=>{
        if(
            article.name.toLocaleLowerCase().includes(search) ||
            article.tags.indexOf(search) > -1 ||
            article.keywords.indexOf(search) > -1
        ){
            return true;
        }else{
            return false;
        }
    }).map((article)=>article.name);
    
    return regularMatches;
}


export const getArticle = (name:string, selectedWiki: WikiMetaData)=>{
    return selectedWiki.articles.find((article)=>article.name === name);
}

export const doesArticleExist = (name:string, selectedWiki: WikiMetaData)=>{
    //cast results to a boolean
    return !!getArticle(name, selectedWiki);
}