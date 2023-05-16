import {BaseHttpService} from "@services/base-http.service";
import type {IStoreInitialQuery} from "@models/general";

export class CheckoutService extends BaseHttpService {
    /**
     * Gets all the required elements to do an initial render of the
     */
    async get() : Promise<IStoreInitialQuery> {
        const res = await fetch(`${import.meta.env.PUBLIC_API_ENDPOINT}get`, {
            headers: this.setHeaders(),
        });

        return await res.json();
    }
}
