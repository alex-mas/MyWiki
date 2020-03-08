import {memoize} from './memoize';

describe('memoize tests', ()=>{

    test('memoize should properly avoid computation when the argument matches', ()=>{
        const shallowCopy = (arg)=>({...arg});
        const memoized = memoize(shallowCopy, 1);
        const myObj = {x:1,y:2};
        const result = memoized(myObj);
        expect(result).toEqual(memoized(myObj));
    })
})