
export interface OrderItem {
  foodItem: {
    _id?: string;
    id?: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id?: string;
  id?: string;
  customer: string | {
    _id?: string;
    id?: string;
    name: string;
    email: string;
  };
  shop: string | {
    _id?: string;
    id?: string;
    name: string;
    logo?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  address: string;
  appliedOffer?: string | null;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'card' | 'upi' | 'cod' | 'wallet';
  createdAt: string;
  updatedAt: string;
}
