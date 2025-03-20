'use client';

import { Button } from "@mui/base";
import { Box, TextField } from "@mui/material";
import fetchApi from "@/app/lib/fetch/fetchApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function BookForm({slotId}) {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Buat FormData kosong
    const formData = new FormData();
    formData.append("id_slot", slotId);
    formData.append("plat_nomor", e.target.plat.value.toUpperCase());
    formData.append("nama_pemesan", "admin");
    formData.append("jenis_mobil", e.target.jenis.value);
  
    // Gunakan toast.promise untuk menampilkan proses loading
    await toast.promise(
      fetchApi({
        method: "post",
        endpoint: "/admin/parkir/booking-slot-khusus",
        data: formData,
        contentType: 'multipart/form-data',
      }),
      {
        pending: "Booking in progress...",
        success: {
          render() {
            router.push("/admin/booking");
            return "Successfully booked!";
          },
        },
        error: {
          render({ data }) {
            return `Error: ${data.message}`;
          },
        },
      }
    );
  };
  

  return (
    <Box component={"form"} onSubmit={handleSubmit} className="w-full h-full flex flex-col bg-white m-[4%] mt-[10%] p-[4%] text-gray-900 text-xl">
      <span className="font-semibold text-primary text-2xl lg:text-4xl my-[4%]">
        Booking Slot Parkir
      </span>
      <div className="flex flex-wrap justify-between gap-y-8">
        <TextField
          id="nama"
          name="nama"
          label="Nama Pemesan"
          value={"Admin"}
          className="w-full shadow-lg "
          color="primary"
          disabled
        />
        <TextField
          id="plat"
          name="plat"
          label="Plat Nomor"
          placeholder="Plat Nomor"
          className="w-full shadow-lg "
          color="primary"
          required
        />
        <TextField
          id="jenis"
          name="jenis"
          label="Jenis Mobil"
          placeholder="Fakultas"
          className="w-full shadow-lg "
          color="primary"
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
          Booking
        </Button>
      </div>
    </Box>
  );
}
