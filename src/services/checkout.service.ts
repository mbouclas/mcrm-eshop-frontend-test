import {BaseHttpService} from "@services/base-http.service";
import type {IStoreInitialQuery} from "@models/general";
import {setHttpLoading} from "@stores/http.store";
import type {ICheckoutStore} from "@stores/checkout.store";
import {object, string} from "yup";
import {extractValidationErrors} from "@helpers/validation";

export class CheckoutService extends BaseHttpService {
    /**
     * Gets all the required elements to do an initial render of the
     */
    async get() : Promise<IStoreInitialQuery> {
        setHttpLoading(true);
        const res = await fetch(`${import.meta.env.PUBLIC_API_ENDPOINT}get`, {
            headers: this.setHeaders(),
        });

        setHttpLoading(false);
        return await res.json();
    }

    async done(data: ICheckoutStore) {
        setHttpLoading(true);
        const order = {
            shippingInformation: data.shippingInformation,
            billingInformation: data.billingInformation,
            paymentMethod: data.paymentMethod,
            shippingMethod: data.paymentMethod.selectedShippingMethod,
            contactInformation: data.contactInformation,
            useBillingInformation: data.useBillingInformation,
            orderMetaData: data.orderMetaData,
        }

        const res = await fetch(`${import.meta.env.PUBLIC_API_ENDPOINT}order`, {
            method: 'POST',
            headers: this.setHeaders(),
            body: JSON.stringify(order),
        });

        setHttpLoading(false);
        return await res.json();
    }

    static orderIsValid(order: ICheckoutStore) {
        let isValid = true,
        errors;
        const schema = object({
            shippingInformation: object().test('is-ok', "${path} missing", (value, context )=> Object.keys(value).length > 0).required(),
            billingInformation: object().test('is-ok', "${path} missing", (value, context )=> Object.keys(value).length > 0).required(),
            paymentMethod: object().test('is-ok', "${path} missing", (value, context )=> Object.keys(value).length > 0).required(),
            contactInformation: object().test('is-ok', "${path} missing", (value, context )=> Object.keys(value).length > 0).required(),
        });

        try {
            schema.validateSync(order, {abortEarly: false});
        }
        catch (e) {
            isValid = false;
            errors = extractValidationErrors(e as any);
        }

        return {isValid, errors};
    }
}
