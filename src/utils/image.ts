import * as imageSize from 'image-size';
import * as url from 'url';
import * as http from 'http';
import * as https from 'https';

export const urlImageSize = (imgUrl: string) => {
    return new Promise((resolve,reject)=>{
        var options = url.parse(imgUrl);
        let method;
        if(imgUrl.startsWith('https://')){
            method = https;
        }else{
            method = http;
        }
        method.get(options, function (response) {
            var chunks: any[] = [];
            response.on('data', function (chunk) {
                chunks.push(chunk);
            }).on('end', function () {
                var buffer = Buffer.concat(chunks);
                resolve(imageSize(buffer));
            });
        });
    });

}