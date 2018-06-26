import { LocalizationProvider } from "../assets/localization/localizationProvider";

export function validateEmptyString(value: string | undefined) {
    if (!value || !value.trim()) {
        return LocalizationProvider.Strings.Common.mustEnterValueError;
    }

    return undefined;
}

export function validateEmptyValue(value: any) {
    if (!value) {
        return LocalizationProvider.Strings.Common.mustEnterValueError;
    }

    return undefined;
}
