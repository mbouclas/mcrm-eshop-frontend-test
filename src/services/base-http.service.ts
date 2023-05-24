import type {IOtp} from "@models/general";

export class BaseHttpService {
    protected sessId: string|null = null;
    protected mainUrl = `${import.meta.env.PUBLIC_BASE_URL}`;
    constructor() {
        this.sessId = localStorage.getItem('sessId');
    }

    public setSession(sessId: string) {
        this.sessId = sessId;
        localStorage.setItem('sessId', sessId);
    }

    public getSession(): string|null {
        return this.sessId;
    }

    protected setHeaders(): any {
        return {
            "Content-Type": "application/json",
            "x-sess-id": this.sessId,
            mode: "cors",
            credentials: "include",
        }
    }

    public async getOtp(): Promise<IOtp> {
        const res = await fetch(`${this.mainUrl}auth/otp`, {
            method: 'GET',
            headers: this.setHeaders(),
        });

        return await res.json();
    }
}
