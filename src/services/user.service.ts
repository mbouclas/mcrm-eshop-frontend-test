import {BaseHttpService} from "@services/base-http.service";
import {setHttpLoading} from "@stores/http.store";
import type {IAddress, ICheckUserEmailResult, IUser} from "@models/user.model";
import type {IGenericObject} from "@models/general";
import {logoutUserAction} from "@stores/user.store";


export class UserService extends BaseHttpService {
    protected baseUrl;

    constructor() {
        super();
        this.baseUrl = `${import.meta.env.PUBLIC_BASE_URL}user/`
    }

    public async login(username: string, password: string, rememberMe = true) {
        const url = `${this.baseUrl}login`;

        const headers = this.setHeaders();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        headers['Authorization'] = 'Basic YWRtaW5BcHA6dG9wU2VjcmV0';
        headers['credentials'] = 'same-origin';

        const urlencoded = new URLSearchParams();
        urlencoded.append("username", username)
        urlencoded.append("password", password)
        urlencoded.append("rememberMe", rememberMe as any)
        urlencoded.append("grant_type", "password")

        setHttpLoading(true);

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: urlencoded,
        });

        const response = await res.json();

        if (response.error) {
            setHttpLoading(false);
            throw new Error(JSON.stringify(response));
        }

        setHttpLoading(false);
        return response;
    }

    async logout() {
        setHttpLoading(true);
        const url = `${this.baseUrl}logout`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: this.setHeaders(),
        });
        setHttpLoading(false);

        const response = await res.json();

        if (response.error) {
            throw new Error(JSON.stringify(response));
        }

        logoutUserAction();
        return response;
    }

    async checkUserEmail(email: string, userInfo?: IGenericObject): Promise<ICheckUserEmailResult> {
        const url = `${this.baseUrl}check-email`;
        setHttpLoading(true);
        const otp = await this.getOtp();
        const res = await fetch(url, {
            method: 'POST',
            headers: this.setHeaders(otp),
            body: JSON.stringify({
                email,
                userInfo,
            }),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    public async getGuestDetails(email: string): Promise<IUser> {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const headers = this.setHeaders(otp);

        const url = `${this.baseUrl}details`;

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({email}),
        });

        setHttpLoading(false);
        return await res.json();
    }

    async syncAddress(address: IAddress, type: 'shipping'|'billing') {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const headers = this.setHeaders(otp);
        const url = `${this.baseUrl}address/sync`;

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({address, type}),
        });

        setHttpLoading(false);
        return await res.json();
    }
}
