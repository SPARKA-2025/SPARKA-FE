'use client';

import Actionbar from "@/app/_components/Actionbar";
import ButtonIcon from "@/app/_components/ButtonIcon";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import fetchApi from "@/app/lib/fetch/fetchApi";
import { toast } from "react-toastify";

export default function Order({}) {
  const [formData, setFormData] = useState({
    plat_nomor: '',
    jenis_mobil: '',
    id_user: 1, // Default user ID, should be from auth context
    id_slot: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { zonaId } = params;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.jenis_mobil) {
      toast.error('Jenis mobil harus diisi');
      return;
    }

    // For now, we'll use a dummy slot ID. In real implementation,
    // this should come from slot selection in the zona page
    const bookingData = {
      ...formData,
      id_slot: parseInt(zonaId) || 1 // Using zonaId as slot ID temporarily
    };

    setIsLoading(true);
    
    try {
      const response = await fetchApi({
        method: 'post',
        endpoint: '/parkir/booking-slot',
        data: bookingData,
        contentType: 'application/json'
      });
      
      toast.success('Booking berhasil!');
      router.push('/area');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(`Booking gagal: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed">
      <Actionbar title={"Booking Slot Parkir"} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className="w-screen h-screen inline-flex py-40 justify-center bg-white flex-col"
      >
        <div className="justify-around flex flex-wrap h-[72%] px-12">
          <TextField
            name="plat_nomor"
            label="Nomor Plat (Opsional)"
            variant="outlined"
            className="w-full"
            color="primary"
            value={formData.plat_nomor}
            onChange={handleInputChange}
            helperText="Kosongkan jika ingin menggunakan plat nomor dari profil"
          />
          <TextField
            name="jenis_mobil"
            label="Jenis Mobil"
            variant="outlined"
            className="w-full"
            color="primary"
            required
            value={formData.jenis_mobil}
            onChange={handleInputChange}
          />
          <Button 
            type="submit"
            variant="contained" 
            color="primary" 
            className="bg-primary w-full h-[12%]" 
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Booking Sekarang'}
          </Button>
        </div>
      </Box>
    </div>
  );
}
