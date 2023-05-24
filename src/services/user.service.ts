import {BaseHttpService} from "@services/base-http.service";
import * as process from "process";
import {setHttpLoading} from "@stores/http.store";
import type {ICheckUserEmailResult, IUser} from "@models/user.model";


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

    async checkUserEmail(email: string): Promise<ICheckUserEmailResult> {
        const url = `${this.baseUrl}check-email`;
        setHttpLoading(true);
        const res = await fetch(url, {
            method: 'POST',
            headers: this.setHeaders(),
            body: JSON.stringify({email}),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    public async getGuestDetails(email: string): Promise<IUser> {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const headers = this.setHeaders();
        headers['x-otp-id'] = otp.id;
        headers['x-otp'] = otp.otp;

        const url = `${this.baseUrl}details`;

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({email}),
        });

        setHttpLoading(false);
        return await res.json();
    }

}
