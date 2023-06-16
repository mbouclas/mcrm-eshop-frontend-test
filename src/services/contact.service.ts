import {BaseHttpService} from "@services/base-http.service";
import {setHttpLoading} from "@stores/http.store";

export class ContactService extends BaseHttpService {
    async submitContactForm(data: any) {
        setHttpLoading(true);
        const res = await fetch(`${import.meta.env.PUBLIC_BASE_URL}contact`, {
            method: 'POST',
            headers: this.setHeaders(),
            credentials: "include",
            body: JSON.stringify(data)
        });
        setHttpLoading(false);
        return await res.json();
    }
}
