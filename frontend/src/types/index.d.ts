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
}

interface Category {
  id: string;
  name: string;
}

interface Status {
    id: string;
    name: string;
}
