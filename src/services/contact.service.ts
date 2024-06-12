import {BaseHttpService} from "@services/base-http.service";
import {setHttpLoading} from "@stores/http.store";

export class ContactService extends BaseHttpService {
    async submitContactForm(data: any) {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const res = await fetch(`${import.meta.env.PUBLIC_BASE_URL}contact`, {
            method: 'POST',
            headers: this.setHeaders(otp),
            credentials: "include",
            body: JSON.stringify(data)
        });
        setHttpLoading(false);
        return await res.json();
    }

    async requestPrice(data: any, productId: string) {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const res = await fetch(`${import.meta.env.PUBLIC_BASE_URL}contact/request-price`, {
            method: 'POST',
            headers: this.setHeaders(otp),
            credentials: "include",
            body: JSON.stringify({...data, ...{productId}})
        });
        setHttpLoading(false);
        return await res.json();
    }
}
