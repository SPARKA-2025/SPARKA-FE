'use client';

import { Button } from "@mui/base";
import { Box, LinearProgress, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import fetchApi from "@/app/lib/fetch/fetchApi";

export default function FormFakultas() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [previewGambar, setPreviewGambar] = useState(null);
  const [sedangUpload, setSedangUpload] = useState(false);

  const handleFileChange = (e) => {
    const fileTerpilih = e.target.files?.[0];
    if (fileTerpilih) {
      setFile(fileTerpilih);
      setPreviewGambar(URL.createObjectURL(fileTerpilih));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Silakan unggah gambar terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append('nama', e.target.nama.value);
    formData.append('deskripsi', e.target.deskripsi.value);
    formData.append('image', file);

    try {
      setSedangUpload(true);
      const res = await fetchApi({
        method: 'post',
        endpoint: '/admin/fakultas',
        data: formData,
        contentType: 'multipart/form-data'
      });

      if (res.status === "success") {
        toast.success('Fakultas berhasil ditambahkan!');
        router.push("/admin/monitoring");
      } else {
        toast.error(`Gagal menambahkan fakultas.\n${JSON.stringify(res)}`);
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan: ${error.message}`);
      console.error('Kesalahan saat menambahkan fakultas:', error);
    } finally {
      setSedangUpload(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col bg-white m-[4%] mt-[10%] p-[4%] text-gray-900 text-xl shadow-md rounded-lg"
    >
      <span className="font-semibold text-primary text-2xl lg:text-4xl my-[4%]">
        Tambah Fakultas
      </span>

      <div className="flex flex-wrap justify-between gap-y-8">
        <TextField
          id="nama"
          name="nama"
          label="Nama Fakultas"
          placeholder="Masukkan nama fakultas"
          className="w-full shadow-sm"
          color="primary"
          required
        />
        <TextField
          id="deskripsi"
          name="deskripsi"
          label="Deskripsi"
          placeholder="Masukkan deskripsi fakultas"
          className="w-full shadow-sm"
          color="primary"
          multiline
          rows={4}
          required
        />
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full shadow-sm"
          required
        />
      </div>

      {file && (
        <div className="mt-4">
          <p className="text-gray-700">
            <strong>File:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
          {previewGambar && (
            <img
              src={previewGambar}
              alt="Pratinjau Gambar"
              className="mt-2 w-full max-w-sm rounded shadow-md"
            />
          )}
        </div>
      )}

      {sedangUpload && (
        <div className="w-full my-4">
          <LinearProgress />
          <p className="text-sm text-gray-500 mt-1">Mengunggah...</p>
        </div>
      )}

      <div className="w-full mt-8 flex justify-between">
        <Button
          variant="contained"
          color="primary"
          className="flex justify-center bg-warn text-white w-[46%] h-fit px-2 py-3 lg:px-3 lg:py-5 lg:text-lg lg:font-semibold rounded-md"
          onClick={() => router.back()}
          type="button"
        >
          Batal
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="flex justify-center bg-primary text-white w-[46%] h-fit px-2 py-3 lg:px-3 lg:py-5 lg:text-lg lg:font-semibold rounded-md"
          type="submit"
          disabled={sedangUpload}
        >
          {sedangUpload ? 'Mengunggah...' : 'Simpan Fakultas'}
        </Button>
      </div>
    </Box>
  );
}
