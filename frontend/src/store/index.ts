//@ts-nocheck
import {create} from 'zustand';

const useStore = create((set) => ({
    cart : [],
    addToCart: (product) => 
        set((state) => {
            const productInCart = state.cart.findIndex((item) => item.id === product.id);

        if (productInCart === -1) {
            return { cart: [...state.cart, {...product, quantity : 1}] }
        } 
        else {
            const updatedCart = [...state.cart];
            updatedCart[productInCart].quantity += 1;
            return updatedCart;
        }
    }),

    removeFromCart: (product) =>
        set((state) => {
            const productIndex = state.cart.findIndex((item) => item.id === product.id);
            const updatedCart = [...state.cart];
            if (productIndex !== -1) {
                updatedCart.splice(productIndex, 1);
            }
            return { cart: updatedCart };
        }),

    reduceQuantity: (product) =>
        set((state) => {
            const productIndex = state.cart.findIndex((item) => item.id === product.id);
            const updatedCart = [...state.cart];
            if (productIndex !== -1) {
                if (updatedCart[productIndex].quantity === 1) {
                    updatedCart.splice(productIndex, 1);
                } 
                else {
                    updatedCart[productIndex].quantity -= 1;
                }
            }
            return { cart: updatedCart };
        })

}))
  

export {useStore}