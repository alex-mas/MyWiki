import * as React from 'react';
import AppHeader from '../components/appHeader';



export class SettingsPage extends React.Component<any, any>{
    render() {
        return (
            <div className='wiki-route'>
                <AppHeader />
                <div className='body'>
                    Settings here...
                </div>
            </div>
        )
    }
}


export default SettingsPage;