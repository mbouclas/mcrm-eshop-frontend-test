import {BaseHttpService} from "@services/base-http.service";
import {setHttpLoading} from "@stores/http.store";
import type {IAddress, ICheckUserEmailResult, IUser, IUserDto} from "@models/user.model";
import type {IGenericObject} from "@models/general";
import {logoutUserAction} from "@stores/user.store";
import type {IOrderQueryResponse} from "@models/order.model";


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

    async checkUserEmail(email: string, userInfo?: IGenericObject, justCheckIfUserExists = false ): Promise<ICheckUserEmailResult> {
        const url = `${this.baseUrl}check-email`;
        setHttpLoading(true);
        const otp = await this.getOtp();
        const res = await fetch(url, {
            method: 'POST',
            headers: this.setHeaders(otp),
            body: JSON.stringify({
                email,
                userInfo,
                jciue: justCheckIfUserExists,
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

    async getUserAccount(): Promise<IUser> {
        setHttpLoading(true);
        const headers = this.setHeaders();

        const url = `${this.baseUrl}account`;

        const res = await fetch(url, {
            method: 'GET',
            headers,
        });

        setHttpLoading(false);
        const result = await res.json();
        if (result.address && Array.isArray(result.address)) {
            result.addresses = result.address;
        }

        return result as IUser;
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

    async register(user: IUserDto) {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const url = `${this.baseUrl}register`;
        const res = await fetch(url, {
            method: 'POST',
            headers: this.setHeaders(otp),
            body: JSON.stringify(user),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    async verifyToken(token: string) {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const url = `${this.baseUrl}verify/${token}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: this.setHeaders(otp),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    async askForPasswordReset(email: string) {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const url = `${this.baseUrl}password-reset?email=${email}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: this.setHeaders(otp),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    async verifyPasswordResetCode(email: string, otpCode: string) {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const url = `${this.baseUrl}verify-reset-otp?email=${email}&otp=${otpCode}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: this.setHeaders(otp),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    async changePassword(email: string, password: string) {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const url = `${this.baseUrl}change-password`;
        const res = await fetch(url, {
            method: 'POST',
            headers: this.setHeaders(otp),
            body: JSON.stringify({email, password}),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    async getOrders(): Promise<IOrderQueryResponse> {
        setHttpLoading(true);

        const url = `${this.baseUrl}orders`;
        const res = await fetch(url, {
            method: 'GET',
            headers: this.setHeaders(),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    async setAddressAsDefault(addressId: string) {
        setHttpLoading(true);

        const url = `${this.baseUrl}address/default/${addressId}`;
        const res = await fetch(url, {
            method: 'PATCH',
            headers: this.setHeaders(),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    async deleteAddress(addressId: string) {
        setHttpLoading(true);

        const url = `${this.baseUrl}address/${addressId}`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: this.setHeaders(),
        });

        const response = await res.json();

        setHttpLoading(false);

        return response
    }

    async addNewAddress(address: IAddress) {
        setHttpLoading(true);
        const otp = await this.getOtp();
        const headers = this.setHeaders(otp);
        const url = `${this.baseUrl}address`;

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({address, type: 'SHIPPING'}),
        });

        setHttpLoading(false);
        return await res.json();
    }
}
