import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './customInput.scss';
import { Header, Label, Icon, Button, Popup } from 'semantic-ui-react';

export interface ICustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    title?: string;
    errorMessage?: string;
    hideErrorIcon?: boolean;
    containerClassName?: string;
    className?: string;

    maxLength?: number;
    type?: any;

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
    private _handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
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
            hideErrorIcon
        } = this.props;

        const containerFieldClassName = classNames('custom-input', containerClassName);

        return <div className={containerFieldClassName}>
            {title && <Header size='small'>{title}</Header>}
            <div className="custom-input__field">
                {this._renderInputField()}
                <span className='custom-input__field__input-error-label'>
                    {errorMessage && !hideErrorIcon &&
                        <Popup
                            trigger={<Icon size='large' name='exclamation' />}
                            content={errorMessage}
                        />
                    }
                </span>
            </div>
        </div>;
    }

    private _renderInputField = () => {
        const {
            errorMessage,
            className,
            maxLength,
            type,
        } = this.props;

        const { value } = this.state;

        const isValid = !errorMessage;
        const inputComponentClass = classNames('custom-input__field__input-field', 'ui input', {
            'custom-input__field__input-field--error': !isValid
        });

        return <span className={inputComponentClass}>
            <input
                maxLength={maxLength}
                type={type}
                value={value}
                className={className}
                onChange={this._handleChange}
            />
        </span>;
    }
}
