//@ts-ignore
import * as retext from 'retext';
//@ts-ignore
import * as retextKeywords from 'retext-keywords';


const extractKeywords = (document: string) => {
    return new Promise<string[]>((resolve, reject) => {
        retext()
            .use(retextKeywords)
            .process(document, (err: Error, file: any) => {
                if (err) { reject(err); }
                const keywords: string[] = file.data.keywords.map((keyword: any) => keyword.stem);
                resolve(keywords);
            });
    });
}


const generatedKeywords = (name: string, wikiId: string,keywords: string[])=>{
    return{
        type: 'GENERATED_KEYWORDS',
        name,
        keywords,
        wikiId
    }
}

onmessage = (event) => {
    const action = event.data;
    switch (action.type) {
        case 'GET_KEYWORDS':
            return extractKeywords(action.contents)
                .then((keywords) => {
                    postMessage(generatedKeywords(action.name,action.wikiId, keywords));
                })
                .catch((err) => {
                    console.warn(err);
                    throw err;
                });
    }
}