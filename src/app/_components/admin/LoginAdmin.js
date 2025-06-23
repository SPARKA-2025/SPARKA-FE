"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, FormLabel, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Button } from "@mui/base";
import Image from "next/image";
import loginAdmin from "@/app/lib/action/admin/login";

export default function LoginAdmin() {
  const router = useRouter();
  const [sedangLogin, setSedangLogin] = useState(false);
  const [tampilkanPassword, setTampilkanPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSedangLogin(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = await loginAdmin(formData);
    if (data?.access_token) {
      toast.success("Berhasil masuk sebagai admin.", {
        autoClose: 2000,
      });

      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } else {
      toast.error(`Gagal masuk: ${data.message}`, {
        autoClose: 3000,
      });
    }
    setSedangLogin(false);
  };

  const toggleTampilkanPassword = () => {
    setTampilkanPassword((prev) => !prev);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/assets/img/bg-adminlogin.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer transition={Bounce} />
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md md:max-w-xl px-8 py-10 rounded-xl shadow-lg"
      >
        <h1 className="text-center text-xl font-bold text-[#102165] mb-6">
          MASUK ADMIN SPARKA
        </h1>

        <div className="flex justify-center items-center mb-6 gap-4">
          <Image
            src="/assets/img/unnesxsparka-colour.svg"
            alt="Logo UNNES x SPARKA"
            width={350}
            height={40}
          />
        </div>

        <div className="mb-4">
          <FormLabel className="font-medium text-gray-700">Alamat Email</FormLabel>
          <TextField
            id="email"
            name="email"
            placeholder="Masukkan email"
            fullWidth
            required
            className="bg-gray-100 rounded"
          />
        </div>

        <div className="mb-6">
          <FormLabel className="font-medium text-gray-700">Kata Sandi</FormLabel>
          <TextField
            id="password"
            name="password"
            type={tampilkanPassword ? "text" : "password"}
            placeholder="Masukkan kata sandi"
            fullWidth
            required
            className="bg-gray-100 rounded"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="tampilkan/sembunyikan sandi"
                    onClick={toggleTampilkanPassword}
                    edge="end"
                  >
                    {tampilkanPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={sedangLogin}
          className="w-full bg-[#102165] text-white font-semibold py-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {sedangLogin ? "Memproses..." : "Masuk"}
        </Button>
      </Box>
    </div>
  );
}
