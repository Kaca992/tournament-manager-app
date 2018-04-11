import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './customInput.scss';
import { Header, Label, Icon, Button, Popup } from 'semantic-ui-react';

export interface ICustomInputProps {
    title?: string;
    errorMessage?: string;
    containerClassName?: string;
    className?: string;
    maxlength?: number;

    value?: any;
    onChange(value: any);
}

export interface ICustomInputState {
    value: any;
}

export default class CustomInput extends React.Component<ICustomInputProps, ICustomInputState> {
    constructor(props: ICustomInputProps) {
        super(props);
        this.state = {
            value: props.value ? props.value : ""
        };
    }

    @autobind
    private _handleChange(e) {
        this.props.onChange(e.target.value);
        this.setState({
            value: e.target.value
        });
    }

    public render() {
        const {
            title,
            errorMessage,
            containerClassName,
            className,
            maxlength
        } = this.props;

        const { value } = this.state;

        const isValid = !errorMessage;
        const containerFieldClassName = classNames('custom-input-field_container', containerClassName);
        const inputComponentClass = classNames('input-field', 'ui input', {
            error: !isValid
        });

        return <div className={containerFieldClassName}>
            {title && <Header size='small'>{title}</Header>}
            <span className={inputComponentClass}>
                <input
                    type={'text'}
                    value={value}
                    className={className}
                    onChange={this._handleChange}
                    maxLength={maxlength}
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
}
