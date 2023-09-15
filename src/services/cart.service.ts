import type {ICart, ICartItem} from "@stores/cart.store";
import {BaseHttpService} from "@services/base-http.service";
import {setHttpLoading} from "@stores/http.store";
import type {IGenericObject} from "@models/general";

export interface IAddToCartDto {
    id: string;
    variantId?: string;
    quantity: number;
    metaData?: IGenericObject;
}
export class CartService extends BaseHttpService {
    async getCart() {
        setHttpLoading(true);
        const res = await fetch(`${import.meta.env.PUBLIC_CART_ENDPOINT}get`, {
            headers: this.setHeaders(),
        });

        if (res.headers.get('x-sess-id')) {
            this.setSession(res.headers.get('x-sess-id') as string);
        }
        setHttpLoading(false);
        return await res.json();
    }

    async addToCart(item: IAddToCartDto, overwriteQuantity = false) {
        setHttpLoading(true);

        const res = await fetch(`${import.meta.env.PUBLIC_CART_ENDPOINT}add`, {
            method: 'POST',
            headers: this.setHeaders(),
            credentials: "include",
            body: JSON.stringify({...item, ...{overwriteQuantity}})
        });
        setHttpLoading(false);
        return await res.json();
    }

    async clearCart() {
        setHttpLoading(true);
        const res = await fetch(`${import.meta.env.PUBLIC_CART_ENDPOINT}clear`, {
            method: 'POST',
            headers: this.setHeaders(),
            credentials: "include",
            body: JSON.stringify({})
        });

        setHttpLoading(false);
        return await res.json();
    }

    async removeFromCart(item: IAddToCartDto) {
        setHttpLoading(true);
        const res = await fetch(`${import.meta.env.PUBLIC_CART_ENDPOINT}${item.id}`, {
            method: 'DELETE',
            headers: this.setHeaders(),
            credentials: "include",
        });

        setHttpLoading(false);
        return await res.json();
    }

    async saveCartToServer(items: ICartItem[]) {
        setHttpLoading(true);

        const res = await fetch(`${import.meta.env.PUBLIC_CART_ENDPOINT}update`, {
            method: 'PATCH',
            headers: this.setHeaders(),
            credentials: "include",
            body: JSON.stringify(items)
        });

        setHttpLoading(false);
        return await res.json();
    }

    async updateShippingMethod(id: string) {
        setHttpLoading(true);

        const res = await fetch(`${import.meta.env.PUBLIC_CART_ENDPOINT}update-shipping`, {
            method: 'POST',
            headers: this.setHeaders(),
            credentials: "include",
            body: JSON.stringify({id})
        });

        setHttpLoading(false);
        return await res.json();
    }
}
