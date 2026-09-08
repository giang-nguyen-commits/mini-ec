export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  updatedAt: string;
};

export type CartLine = CartItem & {
  product: Product;
  lineTotal: number;
  soldOut: boolean;
};

export type OrderItemSnapshot = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  line_total: number;
};

export type PlaceOrderInput = {
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
};

export type PlaceOrderResult =
  | { ok: true; orderId: string; total: number }
  | { ok: false; message: string };

export type OrderStatus = "pending" | "paid" | "canceled";

export type Order = {
  id: string;
  user_id: string | null;
  customer_name: string;
  phone: string;
  address: string;
  total: number;
  items: OrderItemSnapshot[];
  status: OrderStatus;
  created_at: string;
};
