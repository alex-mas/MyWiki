import * as React from 'react';





const Header = (props: any) => {
    return (
        <div className='wiki-header'>
            {props.children}
        </div>
    );
}

export default Header