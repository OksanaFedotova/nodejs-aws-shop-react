import API_PATHS from "~/constants/apiPaths";
import ProductsTable from "~/components/pages/admin/PageProductImport/components/ProductsTable";
import CSVFileImport from "~/components/pages/admin/PageProductImport/components/CSVFileImport";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function PageProductImport() {
  return (
    <Box py={3}>
      <Box mb={2} display="flex" justifyContent="space-between">
        <CSVFileImport
          url={`${API_PATHS.import}/import`}
          title="Import Products CSV"
          handleUpload={(text) =>
            toast(text, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            })
          }
        />
        <ToastContainer />
        <Button
          size="small"
          color="primary"
          variant="contained"
          sx={{ alignSelf: "end" }}
          component={Link}
          to={"/admin/product-form"}
        >
          Create product
        </Button>
      </Box>
      <ProductsTable />
    </Box>
  );
}
