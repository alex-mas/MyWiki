import * as React from 'react';
import Header from './header';
import HomeButton from './homeButton';
import SettingsForm from './appSettingsForm';


interface ComponentProps {

}

interface ComponentState {
    isSettingsFormOpen: boolean
}

class AppHeader extends React.Component<ComponentProps, ComponentState>{
    constructor(props: any) {
        super(props);
        this.state = {
            isSettingsFormOpen: false
        };

    }
    componentDidMount() {
        window.addEventListener('click', this.handleClicksOutsideActions);
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.handleClicksOutsideActions);
    }
    handleClicksOutsideActions = (e: MouseEvent) => {
        console.log('handling click outside', e, this.state);
        //@ts-ignore
        if (this.state.isSettingsFormOpen && !this.actionsRef.current.contains(e.target)) {
            this.setState(() => ({
                isSettingsFormOpen: false
            }));
        }
    }
    actionsRef: React.RefObject<HTMLDivElement> = React.createRef();
    toggleSettings = () => {
        this.setState((prevState) => ({
            isSettingsFormOpen: !prevState.isSettingsFormOpen
        }));
    }
    closeSettings = () => {
        this.setState(() => ({
            isSettingsFormOpen: false
        }));
    }
    render() {
        return (
            <Header>
                <div className='wiki-header__top-actions'>
                    <HomeButton />
                </div>
                <div ref={this.actionsRef} className='wiki-header__bottom-actions'>
                    <button
                        onClick={this.toggleSettings}
                        className='wiki-header__action--secondary'
                    >
                        <i className='icon-btn--secondary material-icons'>settings</i>
                    </button>
                    <SettingsForm
                        isOpen={this.state.isSettingsFormOpen}
                        onClose={this.closeSettings}
                    />
                </div>
            </Header>
        )
    }
}



export default AppHeader;