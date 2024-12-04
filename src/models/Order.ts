import * as Yup from "yup";
import { OrderStatus } from "~/constants/order";

// Схема адреса
export const AddressSchema = Yup.object({
  firstName: Yup.string().required().default(""),
  lastName: Yup.string().required().default(""),
  address: Yup.string().required().default(""),
  comment: Yup.string().default(""),
}).defined();

export type Address = Yup.InferType<typeof AddressSchema>;

// Схема элемента заказа
export const OrderItemSchema = Yup.object({
  productId: Yup.string().required(),
  count: Yup.number().integer().positive().required(),
}).defined();

export type OrderItem = Yup.InferType<typeof OrderItemSchema>;

// Схема истории статусов
export const statusHistorySchema = Yup.object({
  status: Yup.mixed<OrderStatus>().oneOf(Object.values(OrderStatus)).required(),
  timestamp: Yup.number().required(),
  comment: Yup.string().required(),
}).defined();

export type statusHistory = Yup.InferType<typeof statusHistorySchema>;

// Обновленная схема заказа
export const OrderSchema = Yup.object({
  payment: Yup.object().default({}),
  delivery: AddressSchema.required(),
  comments: Yup.string().notRequired().default(""),
  total: Yup.number().required(),
  status: Yup.string().oneOf(["PENDING", "COMPLETED", "CANCELLED"]).required(),
}).defined();

export type Order = Yup.InferType<typeof OrderSchema>;
