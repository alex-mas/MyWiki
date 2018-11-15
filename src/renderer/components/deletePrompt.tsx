import * as React from 'react';
import { PromptFunction } from '@axc/react-components/interactive/prompt';
import { Button } from './button';
import I18String from '@axc/react-components/display/i18string';
import Modal from '@axc/react-components/layout/modal';

export type DeletePromptFunction = (component: string | React.ComponentClass<DeletePromptProps, any> | React.FunctionComponentFactory<DeletePromptProps>, componentProps?: any) => Promise<boolean>;

interface PromptProps {
    title: string;
    onSubmit: PromptFunction;
}
export type DeletePromptProps = PromptProps;


interface PromptState {
    isOpen: boolean
}

export class DeletePrompt extends React.PureComponent<PromptProps, PromptState>{
    constructor(props: PromptProps) {
        super(props);
        this.state = {
            isOpen: true,
        }
    }
    closeModal = () => {
        this.setState(() => ({
            isOpen: false
        }))
    }
    onCancel = () => {
        this.closeModal();
        this.props.onSubmit(false);
    }
    onConfirm = () => {
        this.closeModal();
        this.props.onSubmit(true);
    }

    render() {
        return (
            <Modal
                isOpen={this.state.isOpen}
                delay
                onClose={this.onCancel}
                className='delete-prompt'
            >
                <div className='delete-prompt__title'>
                    <I18String text={this.props.title} format='capitalizeFirst' />
                </div>
                <div className='delete-prompt__options'>
                    <Button
                        btnType='solid'
                        theme='primary'
                        onClick={this.onCancel}
                    >
                        <I18String text='cancel' format='capitalizeFirst' />
                    </Button>
                    <Button
                        btnType='flat'
                        theme='primary'
                        mode='accent'
                        onClick={this.onConfirm}
                    >
                        <I18String text='confirm' format='capitalizeFirst' />
                    </Button>

                </div>
            </Modal>
        );
    }
}
