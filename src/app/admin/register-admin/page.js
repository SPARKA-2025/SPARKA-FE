"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, FormLabel, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Button } from "@mui/base";
import Image from "next/image";
import Sidebar from "@components/Sidebar";

export default function RegisterAdminPage() {
  const router = useRouter();
  const [sedangMendaftar, setSedangMendaftar] = useState(false);
  const [tampilkanPassword, setTampilkanPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSedangMendaftar(true);

    const formData = new FormData(event.target);
    const data = {
      nama: formData.get("nama"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("/api/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Admin berhasil didaftarkan!", {
          position: "top-right",
          autoClose: 2000, // hilang otomatis dalam 2 detik
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      } else {
        toast.error(result.message || "Gagal mendaftar admin.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Terjadi kesalahan saat mendaftar admin.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setSedangMendaftar(false);
    }
  };

  const toggleTampilkanPassword = () => {
    setTampilkanPassword((prev) => !prev);
  };

  return (
    <div className="flex">
      <main
        className="flex-1 min-h-screen w-full flex items-center justify-center bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/img/bg-adminlogin.svg')" }}
      >
        {/* Toast Container */}
        <ToastContainer transition={Bounce} />

        {/* Form Box */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md md:max-w-xl px-8 py-10 rounded-xl shadow-lg"
        >
          <h1 className="text-center text-xl font-bold text-[#102165] mb-6">
            DAFTAR ADMIN SPARKA
          </h1>

          <div className="flex justify-center items-center mb-6 gap-4">
            <Image
              src="/assets/img/unnesxsparka-colour.svg"
              alt="Logo UNNES x SPARKA"
              width={350}
              height={40}
            />
          </div>

          {/* Nama Lengkap */}
          <div className="mb-4">
            <FormLabel className="font-medium text-gray-700">Nama Lengkap</FormLabel>
            <TextField
              id="nama"
              name="nama"
              placeholder="Masukkan nama lengkap"
              fullWidth
              required
              className="bg-gray-100 rounded"
            />
          </div>

          {/* Email */}
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

          {/* Kata Sandi */}
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
                      aria-label="Tampilkan/Sembunyikan sandi"
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

          {/* Tombol Submit */}
          <Button
            type="submit"
            disabled={sedangMendaftar}
            className="w-full bg-[#102165] text-white font-semibold py-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {sedangMendaftar ? "Memproses..." : "Daftar"}
          </Button>
        </Box>

        {/* Sidebar */}
        <Sidebar active={4} />
      </main>
    </div>
  );
}
