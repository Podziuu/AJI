import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTotalPrice = (orderItems: OrderItem[]) =>
  orderItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
