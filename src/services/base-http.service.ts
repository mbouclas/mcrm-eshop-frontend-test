import type {IGenericObject, IOtp} from "@models/general";
import type {IUserStore} from "@models/user.model";

export class BaseHttpService {
    protected sessId: string|null = null;
    protected mainUrl = `${import.meta.env.PUBLIC_BASE_URL}`;
    protected user: IUserStore = {} as IUserStore;
    constructor() {
        this.sessId = localStorage.getItem('sessId');
        this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : {} as IUserStore;
    }

    public setSession(sessId: string) {
        this.sessId = sessId;
        localStorage.setItem('sessId', sessId);
    }

    public getSession(): string|null {
        return this.sessId;
    }

    protected setHeaders(otp?: IOtp): any {
        const headers: IGenericObject = {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            mode: 'cors',
            credentials: "same-origin",
        }


        if (this.sessId && this.sessId.length > 0) {
            headers['x-sess-id'] = this.sessId;
        }

        if (this.user && this.user.accessToken) {
            headers['Authorization'] = `Bearer ${this.user.accessToken}`;
        }

        if (otp) {
            headers['x-otp-id'] = otp.id;
            headers['x-otp'] = otp.otp;
        }

        return headers;
    }

    public async getOtp(): Promise<IOtp> {
        const res = await fetch(`${this.mainUrl}auth/otp`, {
            method: 'GET',
            headers: this.setHeaders(),
        });

        return await res.json();
    }
}
