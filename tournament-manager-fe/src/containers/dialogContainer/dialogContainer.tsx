import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './dialogContainer.scss';
import { DialogTypeEnum } from '../../common/enums';
import { Button, Modal, Loader, Header } from 'semantic-ui-react';
import { IDialogProps } from '../../common/interfaces';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { DialogDuck } from '../../ducks/dialog.duck';
import { DialogParamsType } from './dialog.utils';

export interface IDialogContainerProps {
    dialogTypeEnum: DialogTypeEnum;
    dialogProps: IDialogProps;
    autoCloseOnAccept: boolean;

    dialogParams: DialogParamsType;

    closeDialog();
}

export interface IDialogContainerState {

}

function mapStateToProps(state: IStore): Partial<IDialogContainerProps> {
    return {
        dialogTypeEnum: state.dialog.dialogType,
        dialogProps: state.dialog.dialogProps,
        autoCloseOnAccept: state.dialog.autoCloseOnAccept,
        dialogParams: state.dialog.dialogParams
    };
}

function mapDispatchToProps(dispatch: any): Partial<IDialogContainerProps> {
    return {
        closeDialog: () => dispatch(DialogDuck.actionCreators.closeDialog())
    };
}

class DialogContainer extends React.Component<IDialogContainerProps, IDialogContainerState> {
    constructor(props: IDialogContainerProps) {
        super(props);

    }

    @autobind
    private _renderDialogProps(dialogParams: DialogParamsType): IDialogProps | null {
        const { dialogTypeEnum } = this.props;
        let props: IDialogProps | null = null;

        switch (dialogTypeEnum) {
            case DialogTypeEnum.LoadingInfo:
                props = {
                    dialogContentRender: this._renderLoading
                };
                break;
            case DialogTypeEnum.Message:
                props = {
                    dialogContentRender: this._renderSimpleMessage
                };
                break;
        }

        return props;
    }

    @autobind
    private _onDialogClose(dialogProps: IDialogProps) {
        if (dialogProps.onDialogClosing && !dialogProps.onDialogClosing()) {
            return;
        }

        this.props.closeDialog();
    }

    @autobind
    private _onDialogAccept(dialogProps: IDialogProps) {
        if (dialogProps.onDialogAccepting && !dialogProps.onDialogAccepting()) {
            return;
        }

        if (this.props.autoCloseOnAccept) {
            this.props.closeDialog();
        }
    }

    public render() {
        const { dialogTypeEnum } = this.props;
        if (dialogTypeEnum === DialogTypeEnum.None) {
            return null;
        }

        const defaultProps = this._renderDialogProps(this.props.dialogParams);
        const renderModalProps = { ...defaultProps, ...this.props.dialogProps };

        return <Modal basic size='small' open={true} onClose={() => this._onDialogClose(renderModalProps)} closeOnEscape={false} closeOnRootNodeClick={false}>
            {this._renderHeader(renderModalProps)}
            {this._renderContent(renderModalProps)}
            { (renderModalProps.cancelButtonText || renderModalProps.acceptButtonText) && <Modal.Actions>
                {renderModalProps.cancelButtonText && <Button negative onClick={() => this._onDialogClose(renderModalProps)}> {renderModalProps.cancelButtonText} </Button>}
                {renderModalProps.acceptButtonText && <Button primary onClick={() => this._onDialogAccept(renderModalProps)}> {renderModalProps.acceptButtonText} </Button>}
            </Modal.Actions> }
        </Modal>;
    }

    @autobind
    private _renderHeader(dialogProps: IDialogProps) {
        if (dialogProps.dialogHeaderText) {
            return <Header icon={dialogProps.dialogHeaderIcon} content={dialogProps.dialogHeaderText} />;
        }
    }

    @autobind
    private _renderContent(dialogProps: IDialogProps) {
        const contentClassName = classNames('content-container', dialogProps.contentClassName);

        return <Modal.Content className={contentClassName}>
                {typeof (dialogProps.dialogContentRender) === 'string' ? dialogProps.dialogContentRender : dialogProps.dialogContentRender(this.props.dialogParams)}
            </Modal.Content>;
    }

    @autobind
    private _renderLoading(loadingText: string) {
        return <Loader className='app-main-loader' active size='massive' >{loadingText}</Loader>;
    }

    @autobind
    private _renderSimpleMessage(message: string) {
        return message;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogContainer);
