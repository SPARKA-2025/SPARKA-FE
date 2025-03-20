"use client";

import { Button } from "@mui/base";
import { Box, FormLabel, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import loginAdmin from "@/app/lib/action/admin/login";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useState } from "react";

export default function LoginAdmin() {
  const router = useRouter();
  const [onLogin, setOnLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk kontrol password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOnLogin(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

      await loginAdmin(formData).then((data) => {
      if (data?.access_token) {
        toast.success("Login Success.");
        router.push("/admin");
        return 0
      }
      toast.error(`Login Error: ${data.message}`);
    });

    setOnLogin(false);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-2 p-4 justify-evenly border-2 border-primary rounded-lg w-[60%] max-w-[1024px] h-[50%] md:h-[512px] px-[4%] text-primary"
    >
      <span className="text-center w-full font-semibold text-4xl">
        Login Admin
      </span>
      <div className="w-full">
        <FormLabel className="font-semibold text-lg">Email</FormLabel>
        <TextField
          id="email"
          name="email"
          placeholder="Masukkan email"
          className="w-full shadow-lg"
          color="primary"
          required
        />
      </div>
      <div className="w-full">
        <FormLabel className="font-semibold text-lg">Password</FormLabel>
        <TextField
          id="password"
          name="password"
          type={showPassword ? "text" : "password"} // Kondisional berdasarkan showPassword
          placeholder="Masukkan password"
          className="w-full shadow-lg"
          color="primary"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <Button
        type="submit"
        disabled={onLogin}
        className="flex bg-primary rounded-md text-white p-4 font-semibold w-full text-center justify-center disabled:cursor-not-allowed disabled:bg-blue-200"
      >
        Masuk
      </Button>
    </Box>
  );
}
