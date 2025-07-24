'use client'

import Sidebar from "@/app/_components/Sidebar";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_CONFIG } from "../../../../lib/config/apiConfig.js";
import 'react-toastify/dist/ReactToastify.css';

export default function Main({ params }) {
  const { parkingId } = params;
  const searchParams = useSearchParams();
  const bookingTypeFromUrl = searchParams.get('type');

  const router = useRouter()

  // Sample ticket data (you can replace this with actual data fetching logic)
  const [ticketData, setTicketData] = useState({
    plat_nomor: "Loading...",
    jenis_mobil: "Loading...",
    waktu_booking: "Loading...",
    waktu_booking_berakhir: "Loading..."
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [bookingType, setBookingType] = useState(null); // 'khusus' atau 'biasa'

  useEffect( () => {
    const fetchData = async () => {
      try {
        const baseUrl = API_CONFIG.BASE_URL;
        
        // Get token from API route
        const tokenResponse = await fetch('/api/admin/token');
        if (!tokenResponse.ok) {
          throw new Error('Failed to get authentication token');
        }
        
        const { token } = await tokenResponse.json();
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Gunakan booking type dari URL parameter
        const typeToUse = bookingTypeFromUrl || 'biasa';
        setBookingType(typeToUse);
        
        // Fetch dari endpoint yang sesuai berdasarkan booking type
        const endpoint = typeToUse === 'khusus' 
          ? `/admin/parkir-khusus/${parkingId}`
        : `/admin/parkir/${parkingId}`;
          
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const resp = await response.json();
          if(resp?.data) {
            setTicketData(resp.data);
          }
        } else {
          throw new Error(`Failed to fetch booking data: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching parking data:', error);
        // Fallback ke data sample jika terjadi error
      }
    };
    
    if (parkingId) {
      fetchData();
    }
  }, [parkingId, bookingTypeFromUrl])

  const handleDeleteBooking = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Client-side fetch untuk menghindari server action
      const baseUrl = API_CONFIG.BASE_URL;
      
      // Get token from API route
      const tokenResponse = await fetch('/api/admin/token');
      if (!tokenResponse.ok) {
        throw new Error('Failed to get authentication token');
      }
      
      const { token } = await tokenResponse.json();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Tentukan endpoint berdasarkan jenis booking
      const endpoint = bookingType === 'khusus' 
        ? `/admin/parkir/batal-booking-slot-khusus/${parkingId}`
        : `/admin/parkir/batal-booking-slot/${parkingId}`;
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'success') {
        toast.success('Booking berhasil dihapus!');
        router.push('/admin/booking'); // Kembali ke halaman booking
      } else {
        toast.error(result.pesan || 'Gagal menghapus booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Terjadi kesalahan saat menghapus booking');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white-smoke flex min-h-screen w-full justify-center items-center text-primary">
      <Sidebar />
      <div className="border-black border-2 min-w-64 min-h-64 flex flex-col p-4 ">
        <div className="h-64 relative aspect-square mb-4 border-b-2 border-dashed border-primary">
          <Image src={'/assets/icon/logo.svg'} fill alt="Logo" />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold mb-2">Parking Ticket</h1>
          <div className="border border-gray-300 rounded-lg p-4 w-full max-w-md justify-between">
            <p className="mb-2"><strong>Plat Nomor:</strong> {ticketData?.plat_nomor}</p>
            <p className="mb-2"><strong>Pemesan:</strong> {bookingType === 'khusus' ? 'Admin' : (ticketData?.nama_pemesan || 'User')}</p>
            <p className="mb-2"><strong>Jenis Mobil:</strong> {ticketData?.jenis_mobil}</p>
            <p className="mb-2"><strong>Slot ID:</strong> {ticketData?.id_slot}</p>
            <p className="mb-2"><strong>Waktu Booking:</strong> {ticketData?.waktu_booking}</p>
            <p className="mb-2"><strong>Waktu Berakhir:</strong> {ticketData?.waktu_booking_berakhir}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <button
            className="flex-1 border-primary border-2 border-b-4 active:border-b-2 text-center font-semibold cursor-pointer py-2 rounded"
            onClick={() => router.back()}
          >
            Kembali
          </button>
          <button
            className={`flex-1 border-red-500 border-2 border-b-4 active:border-b-2 text-center font-semibold cursor-pointer py-2 rounded text-red-500 ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleDeleteBooking}
            disabled={isDeleting}
          >
            {isDeleting ? 'Menghapus...' : 'Hapus Booking'}
          </button>
        </div>
      </div>

    </div>
  );
}