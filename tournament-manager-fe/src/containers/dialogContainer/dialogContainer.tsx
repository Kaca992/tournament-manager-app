import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './dialogContainer.scss';
import { DialogTypeEnum } from '../../common/enums';
import { Button, Modal, Loader } from 'semantic-ui-react';
import { IDialogProps } from '../../common/interfaces';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { DialogDuck } from '../../ducks/dialog.duck';

export interface IDialogContainerProps {
    dialogTypeEnum: DialogTypeEnum;
    dialogProps: IDialogProps;
    autoCloseOnAccept: boolean;

    dialogParams?: any;

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
    private static defaultDialogProps: Partial<IDialogProps> = {
        size: 'small',
        hasCloseIcon: false
    };

    constructor(props: IDialogContainerProps) {
        super(props);

    }

    @autobind
    private _renderDialogProps(dialogParams: any): IDialogProps | null {
        const { dialogTypeEnum } = this.props;
        let props: IDialogProps | null = null;

        switch (dialogTypeEnum) {
            case DialogTypeEnum.LoadingInfo:
                props = {
                    dialogContentRender: this._renderLoading
                };
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
        const renderModalProps = { ...DialogContainer.defaultDialogProps, ...defaultProps, ...this.props.dialogProps };

        return <Modal size='large' open={true} onClose={() => this._onDialogClose(renderModalProps)} closeOnEscape={false} closeOnRootNodeClick={false}>
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
            return <Modal.Header>
                {dialogProps.dialogHeaderText}
            </Modal.Header>;
        }
    }

    @autobind
    private _renderContent(dialogProps: IDialogProps) {
        if (typeof (dialogProps.dialogContentRender) === 'string') {
            return <Modal.Content>
                {dialogProps.dialogContentRender}
            </Modal.Content>;
        }

        return dialogProps.dialogContentRender(this.props.dialogParams);
    }

    @autobind
    private _renderLoading(loadingText: string) {
        return <Loader className='app-main-loader' active size='massive' >{loadingText}</Loader>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogContainer);
