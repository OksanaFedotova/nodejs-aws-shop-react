import React, { useState } from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import API_PATHS from "~/constants/apiPaths";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      await axios.post(API_PATHS.user, {
        username,
        password,
      });
      toast("You have registered");
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_PATHS.auth}/login`, {
        username,
        password,
      });
      const token = res.data.data.access_token;
      localStorage.setItem("access_token", token);
     // handleToken(token);
      toast("You have logged in");
      navigate("/cart");
    } catch (error) {
      console.log(error)
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <ToastContainer />
      <TextField
        required
        label="Name"
        helperText="Necessarily"
        sx={{ width: "90%" }}
        onChange={(e) => setName(e.target.value)}
        value={username}
      />
      <TextField
        required
        label="Password"
        helperText="Necessarily"
        sx={{ width: "90%" }}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Button variant="outlined" onClick={handleSignIn} disabled={loading}>
        Sign up (for new users)
      </Button>
      <Button variant="outlined" onClick={handleSignUp} disabled={loading}>
        Sign in (for existing users)
      </Button>
      {loading && <CircularProgress />}
    </Box>
  );
}
