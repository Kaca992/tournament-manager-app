import { ModalProps } from "semantic-ui-react";

export interface IAction {
    type: string;
    payload?: any;
    error?: any;
}

export interface IDialogProps {
    dialogHeaderText?: string;
    dialogContentRender: (dialogParams: any) => JSX.Element | string;

    onDialogClosing?(): boolean;
    onDialogAccepting?(): boolean;

    acceptButtonText?: string;
    cancelButtonText?: string;

    size?: 'fullscreen' | 'large' | 'mini' | 'small' | 'tiny';
    hasCloseIcon?: boolean;
}
