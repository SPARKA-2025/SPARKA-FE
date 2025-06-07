'use client'

import Sidebar from "@/app/_components/Sidebar";
import fetchApi from "@/app/lib/fetch/fetchApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Main({ params }) {
  const { parkingId } = params;

  const router = useRouter()

  // Sample ticket data (you can replace this with actual data fetching logic)
  const [ticketData, setTicketData] = useState({
    plat_nomor: "123456",
    nama_pemesan: "ABC-1234",
    jenis_mobil: "Downtown Parking Lot",
    waktu_booking: "2023-10-01 10:00 AM",
    waktu_booking_berakhir: "2023-10-01 12:00 PM"
  });

  useEffect( () => {
    fetchApi({endpoint:`/admin/parkir/${parkingId}`}).then( resp => {
        if(resp?.data) setTicketData(resp?.data)
    })
  }, [])

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
            <p className="mb-2"><strong>Pemesan:</strong> {ticketData?.nama_pemesan}</p>
            <p className="mb-2"><strong>Jenis Mobil:</strong> {ticketData?.jenis_mobil}</p>
            <p className="mb-2"><strong>Waktu Booking:</strong> {ticketData?.waktu_booking}</p>
            <p className="mb-2"><strong>Waktu Berakhir:</strong> {ticketData?.waktu_booking_berakhir}</p>
          </div>
        </div>
        <div className=" border-primary border-2 border-b-4 active:border-b-2 text-center font-semibold cursor-pointer" onClick={ () => router.back()}>
            Kembali
        </div>
      </div>
    </div>
  );
}