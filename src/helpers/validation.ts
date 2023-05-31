import type { ValidationError } from 'yup';
import type {ILoginError} from "@models/user.model";
import type {IPropertyEs} from "@models/products.model";
import type {IGenericObject} from "@models/general";
export function extractValidationErrors(err: ValidationError) {
    return err.inner.reduce((acc, err) => {
        return { ...acc, [err.path as any]: err.message };
    }, {});
}

export function loginErrorHandler(message: string|ILoginError) {
    let error: ILoginError;
    if (typeof message === 'string') {
        error = JSON.parse(message) as ILoginError;
    } else {
        error = message;
    }

    if (error.code === '401.1') {
        return 'Invalid username or password';
    }
}

export function filterIsApplied(appliedFilters: IGenericObject[], item: IPropertyEs) {
    let found = false;

    appliedFilters.forEach(filter => {
        if (found) {return;}
        const key = Object.keys(filter)[0];
        //like page = 2
        if (!Array.isArray(filter[key])) {
            return;
        }

        filter[key].forEach((value: any) => {
            found = item.slug === value;
            if (found) {return;}
        });
    });

    return found;
}
