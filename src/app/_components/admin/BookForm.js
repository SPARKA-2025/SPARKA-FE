'use client';

import { Button } from "@mui/base";
import { Box, TextField } from "@mui/material";
import fetchApi from "@/app/lib/fetch/fetchApi";
import { API_CONFIG } from "../../lib/config/apiConfig.js";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function BookForm({slotId}) {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ekstrak angka dari slotId (misal: 'slot-7' -> '7')
    const slotNumber = slotId.toString().replace(/\D/g, '');
    
    // Validasi slotId
    if (!slotNumber || isNaN(parseInt(slotNumber, 10))) {
      toast.error('Invalid slot ID: unable to extract slot number');
      return;
    }
  
    // Buat data object untuk JSON
    const bookingData = {
      id_slot: parseInt(slotNumber, 10), // Konversi ke integer
      plat_nomor: e.target.plat.value.toUpperCase(),
      jenis_mobil: e.target.jenis.value
    };
    
    // Send booking data
  
    // Gunakan toast.promise untuk menampilkan proses loading
    await toast.promise(
      fetchAdminApi({
        method: "post",
        endpoint: "/admin/parkir/booking-slot-khusus",
        data: bookingData,
        contentType: 'application/json',
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

  // Fungsi fetch khusus untuk admin yang tidak menambahkan prefix /api
  const fetchAdminApi = async ({ method = 'get', endpoint, data, contentType }) => {
    const tokenResponse = await fetch('/api/admin/token');
    const tokenData = await tokenResponse.json();
    const token = tokenData.token || 'false';
    
    const url = `${API_CONFIG.BASE_URL}${endpoint}`; // Endpoint sudah termasuk /api prefix
    
    // Tentukan body berdasarkan tipe data
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
    
    // Tentukan headers
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(contentType && contentType !== 'multipart/form-data' && { 'Content-Type': contentType || 'application/json' }),
    };

    try {
      const response = await fetch(url, { method, headers, body });
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status}: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
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
