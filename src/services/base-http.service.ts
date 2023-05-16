export class BaseHttpService {
    protected sessId: string|null = null;
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
}
