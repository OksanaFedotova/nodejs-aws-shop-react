import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data = { items: [] }, isFetching } = useCart();
  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  const cartItem = data?.items?.find((i) => i.product_id === product.id);

  const addProduct = () => {
    if (product && product.id) {
      upsertCart(
        { items: [{ product_id: product.id, count: 1 }] },
        {
          onSuccess: () => {
            invalidateCart();
          },
          onError: (error) => {
            if (error instanceof AxiosError && error.response) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Error adding product to cart");
            }
            console.error("Error adding product to cart:", error);
          },
        }
      );
    }
  };

  const removeProduct = () => {
    if (cartItem && product.id) {
      upsertCart(
        { items: [{ product_id: product.id, count: -1 }] },
        {
          onSuccess: invalidateCart,
          onError: (error) => {
            if (error instanceof AxiosError && error.response) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Error removing product from cart");
            }
            console.error("Error removing product from cart:", error);
          },
        }
      );
    }
  };
  return cartItem ? (
    <>
      <IconButton disabled={isFetching} onClick={removeProduct} size="large">
        <Remove color={"secondary"} />
      </IconButton>
      <Typography align="center">{cartItem.count}</Typography>
      <IconButton disabled={isFetching} onClick={addProduct} size="large">
        <Add color={"secondary"} />
      </IconButton>
    </>
  ) : (
    <IconButton disabled={isFetching} onClick={addProduct} size="large">
      <CartIcon color={"secondary"} />
    </IconButton>
  );
}
