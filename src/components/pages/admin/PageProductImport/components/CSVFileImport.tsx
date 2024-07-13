import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
  handleUpload: (arg: string) => void;
};
interface ErrorResponse {
  message: string;
}
export default function CSVFileImport({
  url,
  title,
  handleUpload,
}: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | "">();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    const authorizationToken = localStorage.getItem("authorization_token");

    if (!authorizationToken) {
      handleUpload("Authorization token not found");
      return;
    }

    if (!file) {
      handleUpload("No file selected");
      return;
    }

    try {
      // Step 1: Perform GET request to retrieve presigned URL
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          Authorization: `Basic ${authorizationToken}`,
        },
      });

      // Step 2: Use presigned URL to upload file
      const result = await fetch(response.data.url, {
        method: "PUT",
        body: file,
      });

      // Check if upload was successful
      if (result.ok) {
        handleUpload("File is uploaded!");
      } else {
        console.log("Upload error: ", result.status);
        handleUpload(`Error during file upload: ${result.status}`);
      }

      console.log("Result: ", result);
      setFile("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const status = error.response?.status;
        const message = axiosError.response?.data.message;
        if (status === 401 || status === 403) {
          handleUpload(`Authorization error: ${message}`);
        } else {
          handleUpload(`HTTP error: ${status}`);
        }
      } else {
        console.error("Unknown error: ", error);
        handleUpload("Error during file upload");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
