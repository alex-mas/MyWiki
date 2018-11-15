import * as React from 'react';
import Header from './header';
import { withHistoryContext, MemoryHistory, MemoryLink } from '@axc/react-components/navigation/memoryRouter';
import HomeButton from './homeButton';
import SettingsForm from './appSettingsForm';
import { Button } from './button';


export interface AppHeaderProps {

}

export interface AppHeaderState {
    isSettingsFormOpen: boolean
}

class AppHeader extends React.Component<AppHeaderProps, AppHeaderState>{
    constructor(props: any) {
        super(props);
        this.state = {
            isSettingsFormOpen: false
        }

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
                <HomeButton />
                <div ref={this.actionsRef} className='wiki-header__actions'>
                    <button
                        onClick={this.toggleSettings}
                        className='wiki-header__action--secondary'
                    >
                        <i className='material-icons'>settings</i>
                    </button>
                    <SettingsForm isOpen={this.state.isSettingsFormOpen} onClose={this.closeSettings} />
                </div>
            </Header>
        )
    }
}



export default AppHeader;