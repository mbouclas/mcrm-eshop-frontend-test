import {addToCartAction, cart, removeFromCart} from "@stores/cart.store";
import type { ICart, ICartItem } from '@stores/cart.store';


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

    async changeQuantity(idx: number, quantity?: number) {
        // setTimeout is needed to get the correct value from the select
        setTimeout(async () => {
            if (this.Cart.items) {
                if (quantity) {
                    this.Cart.items[idx].quantity = quantity
                }

                await addToCartAction({
                    id: this.Cart.items[idx].productId,
                    quantity: this.Cart.items[idx].quantity,
                    variantId: this.Cart.items[idx].variantId,
                    metaData: this.Cart.items[idx].metaData,
                }, true);
            }
        });
    }
}

