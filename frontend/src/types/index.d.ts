interface Status {
  id: string;
  name: string;
}

interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  confirmedAt?: Date;
  createdAt: Date;
  review?: string;
  status: Status;
  statusId: string;
  userId: string;
  orderItems: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  weight: number;
  category: Category;
  description: string;
  quantity?: number;
}

interface Category {
  id: string;
  name: string;
}

interface Status {
  id: string;
  name: string;
}

interface DropdownProps {
  label: string;
  options: Category[] | Status[];
  selected: string;
  onSelect: (value: string) => void;
}

type Role = "CLIENT" | "WORKER";

type Store = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  reduceQuantity: (product: Product) => void;
  clearCart: () => void;
};

interface User {
  id: string;
  role: Role;
}

enum Role {
  CLIENT = "CLIENT",
  WORKER = "WORKER",
}

type UserStore = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}
