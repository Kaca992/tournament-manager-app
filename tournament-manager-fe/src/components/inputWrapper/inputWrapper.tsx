import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './inputWrapper.scss';
import { Header, Label, Icon, Button, Popup } from 'semantic-ui-react';

export interface IInputWrapperProps {
    title?: string;
    errorMessage?: string;
}

export interface IInputWrapperState {
    focused: boolean;
}

export default function createInputWrapper<TComponentProps>(
    InputComponent: React.ComponentClass<TComponentProps>): React.ComponentClass<TComponentProps & IInputWrapperProps> {

    return class extends React.Component<TComponentProps & IInputWrapperProps, IInputWrapperState> {
        constructor(props) {
            super(props);

            this.state = {
                focused: false
            };

            this._onInputBlur = this._onInputBlur.bind(this);
            this._onInputFocus = this._onInputFocus.bind(this);
        }

        public render() {
            const {
                title,
                errorMessage
            } = this.props;

            const isValid = !errorMessage;
            const inputComponentClass = classNames('input-field', {
                error: !isValid
            });

            return <div className='input-field_container'>
                {title && <Header size='small'>{title}</Header>}
                <span onFocus={this._onInputFocus} onBlur={this._onInputBlur} className={inputComponentClass}>
                    <InputComponent
                        {...this.props}
                    />
                </span>
                <span className='input-error-label'>
                    {errorMessage &&
                        <Popup
                            trigger={<Icon size='large' name='exclamation' />}
                            content={errorMessage}
                        />
                    }
                </span>
            </div>;
        }

        private _onInputFocus() {
            this.setState({
                focused: true
            });
        }

        private _onInputBlur() {
            this.setState({
                focused: false
            });
        }
    };
}