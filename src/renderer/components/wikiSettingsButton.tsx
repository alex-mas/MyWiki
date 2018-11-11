import * as React from 'react';
import  I18String  from '@axc/react-components/display/i18string';
import { Modal } from '@axc/react-components/layout/modal';
import WikiSettingsForm from './wikiSettingsForm';
import { connect } from 'react-redux';
import { AppState } from '../store/store';
import { WikiMetaData } from '../store/reducers/wikis';

const root = document.getElementById('app');


interface OwnProps {
    wikiID?: string,
    className: string
}
interface ReduxProps {
    wikiID?: string
}
type ButtonProps = OwnProps & ReduxProps;

export class WikiSettingsButton extends React.Component<ButtonProps, {isFormOpen: boolean}>{
    constructor(props:any){
        super(props);
        this.state = {
            isFormOpen: false
        };
    }
    toggleForm =()=>{
        this.setState((prevState)=>({
            isFormOpen: !prevState.isFormOpen
        }));
    }
    render(){
        return(
           <React.Fragment>
               <a
                    className={this.props.className}
                    onClick={this.toggleForm}
               >       
                   <i className='material-icons'>
                        settings             
                    </i>
                    <I18String text='settings' />
                </a>
                <Modal
                    onClose={this.toggleForm}
                    isOpen={this.state.isFormOpen}
                    root={root}
                >
                    <WikiSettingsForm
                        onClose={this.toggleForm}
                        isOpen={true}
                        wikiID={this.props.wikiID}
                    />
                </Modal>
           </React.Fragment>
        )
    }
}


export default connect((state: AppState,props: OwnProps)=>{
    if(!props.wikiID){
        return{
            wikiID: state.selectedWiki.id
        }
    }
})(WikiSettingsButton);