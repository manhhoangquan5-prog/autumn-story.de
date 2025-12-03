export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  addressExtra?: string;
  postalCode: string;
  city: string;
  orderDate: string;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedSize?: string;
    selectedColor?: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'bankTransfer' | 'paypal';
  status: 'pending' | 'processing' | 'shipped' | 'in_transit_germany' | 'received' | 'completed' | 'cancelled';
  trackingNumber?: string;
}
