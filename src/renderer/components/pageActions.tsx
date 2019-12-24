import * as React from 'react';
import {HomeButton} from "./homeButton"
import  Notifications from "./notifications"




export const PageActions: React.FunctionComponent<any> = (props: any) => {
    return (
        <div className="action-container">
            <HomeButton className='page-action' />
            {props.children}
            <Notifications />
        </div>
    )
}

export default PageActions;