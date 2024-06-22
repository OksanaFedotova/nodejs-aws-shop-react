import * as Yup from "yup";

export const StockSchema = Yup.object({
  count: Yup.number().integer().min(0).required().default(0),
  product_id: Yup.string().required(),
});

export type Stock = Yup.InferType<typeof StockSchema>;
