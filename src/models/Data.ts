import * as Yup from "yup";
import { ProductSchema } from "~/models/Product";
import { StockSchema } from "~/models/Stock";

export const DataSchema = Yup.object({
  products: Yup.array().of(ProductSchema).required(),
  stocks: Yup.array().of(StockSchema).required(),
});

// Определяем тип для модели данных
export type Data = Yup.InferType<typeof DataSchema>;
