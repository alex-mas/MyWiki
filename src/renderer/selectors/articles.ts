import { SelectedWiki } from "../store/reducers/selectedWiki";


/**
 * reduces the array of articles to an array of article names
 * 
 */
export const getArticleNames = (selectedWiki: SelectedWiki): string[]=>{
    return selectedWiki.articles.map((article)=>{
        return article.name;
    });
};


/**
 * 
 * v1 of article search -> we check for a partial match on article names or an exact match of any of its tags.
 * 
 * 
 */
export const getRelevantArticles= (search:string, selectedWiki: SelectedWiki): string[]=>{
    return selectedWiki.articles.filter((article)=>{
        if(article.name.includes(search)){
            return true;
        }else if(article.tags.indexOf(search) > -1){
            return true;
        }else{
            return false;
        }
    }).map((article)=>article.name);
}


export const getArticle = (name:string, selectedWiki: SelectedWiki)=>{
    return selectedWiki.articles.find((article)=>article.name === name);
}