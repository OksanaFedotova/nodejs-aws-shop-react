import Products from "~/components/pages/PageProducts/components/Products";
import Box from "@mui/material/Box";
import { ToastContainer } from "react-toastify";

export default function PageProducts() {
  return (
    <Box py={3}>
      <ToastContainer />
      <Products />
    </Box>
  );
}
