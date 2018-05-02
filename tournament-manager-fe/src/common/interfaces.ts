import { ModalProps } from "semantic-ui-react";

export interface IAction {
    type: string;
    payload?: any;
    error?: any;
}

export interface IDialogProps {
    dialogHeaderText?: string;
    dialogHeaderIcon?: any;
    dialogContentRender: (dialogParams: any) => JSX.Element | string;

    onDialogClosing?(): boolean;
    onDialogAccepting?(): boolean;

    acceptButtonText?: string;
    cancelButtonText?: string;

    contentClassName?: string;
}
