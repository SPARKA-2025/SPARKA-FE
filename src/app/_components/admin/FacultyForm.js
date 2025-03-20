'use client';

import { Button } from "@mui/base";
import { Box, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import fetchApi from "@/app/lib/fetch/fetchApi";

export default function FacultyForm() {
  const router = useRouter();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('nama', e.target.nama.value);
    formData.append('deskripsi', e.target.deskripsi.value);
    formData.append('image', file);

    try {
      const res = await fetchApi({
        method: 'post',
        endpoint: '/admin/fakultas',
        data: formData,
        contentType: 'multipart/form-data'
      });

      if (res.status === "success") {
        toast.success('Faculty added successfully!');
        router.push("/admin/monitoring");
      } else {
        toast.error(`Failed to add faculty. Please try again.\n${JSON.stringify(res)}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error('Faculty Addition Error:', error);
    }
  };

  return (
    <Box component={"form"} onSubmit={handleSubmit} className="w-full h-full flex flex-col bg-white m-[4%] mt-[10%] p-[4%] text-gray-900 text-xl">
      <span className="font-semibold text-primary text-2xl lg:text-4xl my-[4%]">
        Add Faculty
      </span>
      <div className="flex flex-wrap justify-between gap-y-8">
        <TextField
          id="nama"
          name="nama"
          label="Nama Fakultas"
          placeholder="Nama Fakultas"
          className="w-full shadow-lg"
          color="primary"
          required
        />
        <TextField
          id="deskripsi"
          name="deskripsi"
          label="Deskripsi"
          placeholder="Deskripsi Fakultas"
          className="w-full shadow-lg"
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
          className="w-full shadow-lg"
          required
        />
      </div>
      <div className="w-full my-[4%] flex justify-between">
        <Button
          variant="contained"
          color="primary"
          className="flex justify-center bg-warn text-white w-[46%] h-fit px-2 py-3 lg:px-3 lg:py-5 lg:text-lg lg:font-semibold rounded-md"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="flex justify-center bg-primary text-white w-[46%] h-fit px-2 py-3 lg:px-3 lg:py-5 lg:text-lg lg:font-semibold rounded-md"
          type="submit"
        >
          Add Faculty
        </Button>
      </div>
    </Box>
  );
}
