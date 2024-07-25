import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReviewCart from "~/components/pages/PageCart/components/ReviewCart";
import ReviewOrder from "~/components/pages/PageCart/components/ReviewOrder";
import PaperLayout from "~/components/PaperLayout/PaperLayout";
import { Address, AddressSchema, Order } from "~/models/Order";
import Box from "@mui/material/Box";
import { useCart, useInvalidateCart } from "~/queries/cart";
import AddressForm from "~/components/pages/PageCart/components/AddressForm";
import { useSubmitOrder } from "~/queries/orders";
import { useAvailableProducts } from "~/queries/products";
import { CartItem } from "~/models/CartItem";
import { AxiosError } from "axios";

enum CartStep {
  ReviewCart,
  Address,
  ReviewOrder,
  Success,
}
interface ErrorResponse {
  message?: string;
}

interface ApiError {
  response?: {
    data?: ErrorResponse;
  };
}

const initialAddressValues = AddressSchema.cast({});

const CartIsEmpty = () => (
  <Typography variant="h6" gutterBottom>
    The cart is empty. Didn&apos;t you like anything in our shop?
  </Typography>
);

const Success = () => (
  <React.Fragment>
    <Typography variant="h5" gutterBottom>
      Thank you for your order.
    </Typography>
    <Typography variant="subtitle1">
      Your order is placed. Our manager will call you soon to clarify the
      details.
    </Typography>
  </React.Fragment>
);

const steps = ["Review your cart", "Shipping address", "Review your order"];

export default function PageCart() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("access_token");
      setToken(newToken);
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange(); // Установите начальное состояние токена

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/signup");
      return;
    }
  }, [token, navigate]);

  const { data: products = [] } = useAvailableProducts();

  const { data = { items: [] }, isError, isLoading, error } = useCart();

  useEffect(() => {
    if (isError && error?.response?.status === 401) {
      navigate("/signup");
    }
  }, [isError, error, navigate]);

  // Преобразование и фильтрация данных
  const productsInCart: CartItem[] = (data.items || [])
    .map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product && item.count > 0) {
        // Убедитесь, что count больше 0
        return {
          product,
          count: item.count,
        } as CartItem; // Приведение типа
      }
      return null;
    })
    .filter((item): item is CartItem => item !== null); // Фильтрация и указание типа

  const { mutate: submitOrder } = useSubmitOrder();
  const invalidateCart = useInvalidateCart();
  const [activeStep, setActiveStep] = React.useState<CartStep>(
    CartStep.ReviewCart
  );
  const [address, setAddress] = useState<Address>(initialAddressValues);
  const isCartEmpty = data.items ? data.items.length === 0 : true;

  const handleNext = () => {
    if (activeStep !== CartStep.ReviewOrder) {
      setActiveStep((step) => step + 1);
      return;
    }
    const values = {
      payment: {},
      delivery: {
        address: address.address,
        comment: address.comment,
        firstName: address.firstName,
        lastName: address.lastName,
      },
      comments: address.comment,
      status: "PENDING",
      total: productsInCart.reduce((acc, item) => {
        return acc + (item?.count ?? 0) * (item?.product?.price ?? 0);
      }, 0),
    };

    submitOrder(values, {
      onSuccess: () => {
        setActiveStep(activeStep + 1);
        invalidateCart();
      },
    });
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleAddressSubmit = (values: Address) => {
    setAddress(values);
    handleNext();
  };

  if (!token || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isError && (
        <div>
          Error:
          {(error as ApiError).response?.data?.message ||
            "An unknown error occurred"}
        </div>
      )}
      {token && products.length && !isError && (
        <PaperLayout>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper
            activeStep={activeStep}
            sx={{ padding: (theme) => theme.spacing(3, 0, 5) }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {isCartEmpty && <CartIsEmpty />}
          {!isCartEmpty && activeStep === CartStep.ReviewCart && (
            <ReviewCart items={productsInCart as unknown as CartItem[]} />
          )}
          {activeStep === CartStep.Address && (
            <AddressForm
              initialValues={address}
              onBack={handleBack}
              onSubmit={handleAddressSubmit}
            />
          )}
          {activeStep === CartStep.ReviewOrder && (
            <ReviewOrder address={address} items={productsInCart} />
          )}
          {activeStep === CartStep.Success && <Success />}
          {!isCartEmpty &&
            activeStep !== CartStep.Address &&
            activeStep !== CartStep.Success && (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== CartStep.ReviewCart && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, ml: 1 }}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </Button>
              </Box>
            )}
        </PaperLayout>
      )}
    </>
  );
}
