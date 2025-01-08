import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const productInCart = state.cart.findIndex(
            (item) => item.id === product.id
          );

          if (productInCart === -1) {
            return { cart: [...state.cart, { ...product, quantity: 1 }] };
          } else {
            const updatedCart = [...state.cart];
            if (updatedCart[productInCart]) {
              updatedCart[productInCart].quantity =
                (updatedCart[productInCart].quantity || 0) + 1;
            }
            return { cart: updatedCart };
          }
        }),

      removeFromCart: (product) =>
        set((state) => {
          const productIndex = state.cart.findIndex(
            (item) => item.id === product.id
          );
          const updatedCart = [...state.cart];
          if (productIndex !== -1) {
            updatedCart.splice(productIndex, 1);
          }
          return { cart: updatedCart };
        }),

      reduceQuantity: (product) =>
        set((state) => {
          const productIndex = state.cart.findIndex(
            (item) => item.id === product.id
          );
          const updatedCart = [...state.cart];
          if (productIndex !== -1) {
            if (updatedCart[productIndex].quantity === 1) {
              updatedCart.splice(productIndex, 1);
            } else {
              updatedCart[productIndex].quantity =
                (updatedCart[productIndex].quantity || 0) - 1;
            }
          }
          return { cart: updatedCart };
        }),
      clearCart: () =>
        set(() => ({
          cart: [],
        })),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export { useStore, useUserStore };
