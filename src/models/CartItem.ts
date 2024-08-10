import { Product } from "~/models/Product";
import { AxiosResponse } from "axios";

export type CartItem = {
  product: Product;
  count: number;
};
export type CartItemRequest = {
  items: {
    product_id: string;
    count: number;
  }[];
};
// Интерфейс для данных корзины
export interface CartItemResponse {
  id: string;
  product_id: string;
  count: number;
}

// Интерфейс для структуры данных, возвращаемых API
export interface CartData {
  created_at: string;
  id: string;
  items: CartItemResponse[];
  status: "OPEN" | "ORDERED";
  updated_at: string;
  user_id: string;
}

export interface CartDataResponse {
  cart: CartData | PromiseLike<CartData>;
}

export interface CartResponse extends AxiosResponse {
  data: {
    data: CartDataResponse;
  };
}
