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
                console.log(file);
                const keywords: string[] = file.data.keywords.map((keyword: any) => keyword.stem);
                resolve(keywords);
            });
    });
}


onmessage = (event) => {
    console.log('Event recieved at the worker', event);
    switch (event.data.event) {
        case 'GET_KEYWORDS':
            return extractKeywords(event.data.payload)
                .then((keywords) => {
                    console.log('success on ml worker, keywords extracted from text are: ', keywords);
                    postMessage(keywords);
                })
                .catch((err) => {
                    console.warn('error on ml worker', err);
                    postMessage([]);
                })
    }
}