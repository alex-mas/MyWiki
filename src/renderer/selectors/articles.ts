import { SelectedWiki } from "../store/reducers/selectedWiki";



export const getArticleNames = (selectedWiki: SelectedWiki): string[]=>{
    return selectedWiki.articles.map((article)=>{
        return article.name;
    });
}