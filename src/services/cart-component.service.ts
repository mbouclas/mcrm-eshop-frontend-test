import {addToCartAction, cart, removeFromCart} from "@stores/cart.store";
import type { ICart, ICartItem } from '@stores/cart.store';
import {rearg} from "lodash";

export class CartHandlers {
   constructor(public Cart: ICart) {
   }

   public getCart() {
         return this.Cart;
   }

   public setCart(cart: ICart) {
       this.Cart = cart;
   }
    async removeItemFromCart(item: ICartItem) {
        await removeFromCart({id: item.productId, quantity: 0});
    }

    async changeQuantity(idx: number) {
        // setTimeout is needed to get the correct value from the select
        setTimeout(async () => {
            if (this.Cart.items) {
                await addToCartAction({id: this.Cart.items[idx].productId, quantity: this.Cart.items[idx].quantity}, true);
            }
        });
    }
}

