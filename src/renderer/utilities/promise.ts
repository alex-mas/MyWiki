


//https://stackoverflow.com/questions/31424561/wait-until-all-es6-promises-complete-even-rejected-promises/36115549#36115549
export const settle = (promiseArray: Promise<any>[])=>{
    return Promise.all(promiseArray.map(p => p.catch(e => e)));
}



export default {
    settle
};