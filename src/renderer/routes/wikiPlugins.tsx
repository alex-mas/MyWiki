import * as React from 'react';
import WikiHeader from '../components/wikiHeader';



export class WikiPluginsPage extends React.Component<any, any>{
    render() {
        return (
            <div className='wiki-route'>
                <WikiHeader/>
                <div className='body'>
                    No plugin data yet...
                </div>
            </div>
        )
    }
}


export default WikiPluginsPage;