import 'isomorphic-fetch';
import { appendServiceApiEndpoint } from './configOptions';

export interface ICustomFetchOptions {
    action?: string;
    hasResult?: boolean;
}

export function fetcher(url: string, customOptions: ICustomFetchOptions, dispatch: any, init?: RequestInit): Promise<any> {
    let options: any = {
        mode: 'cors',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json'
        },
        ...init
    };

    let fullUrl = appendServiceApiEndpoint(url);

    const {action} = customOptions;

    if (action !== undefined) {
        dispatch({
            type: actionUtils.requestAction(action),
            payload: null
        });
    }

    return fetch(fullUrl, options)
        .then(response => {
            if (response.ok) {
                if (customOptions.hasResult) {
                    return response.json().then(jsonResponse => {
                        if (action !== undefined) {
                            dispatch({
                                type: actionUtils.responseAction(action),
                                payload: jsonResponse
                            });
                        }

                        return Promise.resolve(jsonResponse);
                    });
                }

                if (action !== undefined) {
                    dispatch({
                        type: actionUtils.responseAction(action),
                        payload: null
                    });
                }

                return Promise.resolve();
            } else {
                const error = new Error(response.statusText);

                if (action !== undefined) {
                    dispatch({
                        type: actionUtils.errorAction(action),
                        payload: null
                    });
                }

                throw error;
            }
        });
}

export const actionUtils = {
    requestAction(action: string): string {
        return `${action}_REQUEST`;
    },

    responseAction(action: string): string {
        return `${action}_RESPONSE`;
    },

    errorAction(action: string): string {
        return `${action}_ERROR`;
    },
};
