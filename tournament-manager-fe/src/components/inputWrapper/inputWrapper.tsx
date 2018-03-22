import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './inputWrapper.scss';
import { Header, Label } from 'semantic-ui-react';

export interface IInputWrapperProps {
    title?: string;
    errorMessage?: string;
}

export default function createInputWrapper<TComponentProps>(
    InputComponent: React.ComponentClass<TComponentProps>): React.ComponentClass<TComponentProps & IInputWrapperProps> {

    return class extends React.Component<TComponentProps & IInputWrapperProps> {
        public render() {
            const {
                title,
                errorMessage
            } = this.props;

            return <div className='input-field_container'>
                {title && <Header size='small'>{title}</Header>}
                <InputComponent {...this.props} />
                {errorMessage && <Label color='red' pointing>{errorMessage}</Label>}
            </div>;
        }
    };
}
