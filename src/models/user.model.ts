export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    gates?: any[] | null;
    addresses?: IAddress[];
}
export interface IUserStore extends IUser {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
}

export interface ILoginError {
    error: string;
    reason: string;
    code: string;
}

export interface IAddress {
    zipcode: string;
    country: string;
    firstName: string;
    lastName: string;
    city: string;
    phone: string;
    street: string;
    region: string;
    default: boolean;
}

export interface ICheckUserEmailResult {
    email: string;
    exists: boolean;
    type?: 'guest' | 'user';
}

export interface IUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}
