"use client";

import Sidebar from "@/app/_components/Sidebar";
import { Button } from "@mui/base";
import PlusIcon from "@icon/plus.svg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import fetchApi from "@/app/lib/fetch/fetchApi";

import BookBerlangsungIcon from "@icon/book-berlangsung.svg";
import BookSelesaiIcon from "@icon/book-selesai.svg";
import BookDibatalkanIcon from "@icon/book-dibatalkan.svg";

export default function Main() {
  const [bookData, setBookData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Berlangsung");

  const router = useRouter();

  useEffect(() => {
    fetchApi({ endpoint: "/admin/parkir" }).then((res) => {
      const { parkir, parkir_khusus } = res.data
      // Tambahkan flag untuk membedakan jenis booking
      const parkirWithType = parkir.map(item => ({ ...item, bookingType: 'biasa' }));
      const parkirKhususWithType = parkir_khusus.map(item => ({ ...item, bookingType: 'khusus' }));
      setBookData([ ...parkirWithType, ...parkirKhususWithType]);
      console.log(res);
    });
  }, []);

  function BookCard({
    date = new Date(Date.now()),
    title = "Parkiran Depan Digital Center UNNES",
    parkingId = "#",
    status = "Berlangsung",
    slotId = null,
    platNomor = "",
    bookingType = "biasa",
  }) {
    const currDate = date.toDateString();
    return (
      <div className="relative flex flex-col min-w-fit self-start w-full lg:w-2/5 items-end bg-white shadow-xl border-primary p-5 lg:p-[2%] rounded-md">
        {bookingType === 'khusus' && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            KHUSUS
          </div>
        )}
        <div className="flex w-full ">
          <div className="size-16 bg-primary text-white p-[1%] flex justify-center items-center text-center rounded-md">
            {filterStatus === "Berlangsung" ? (
              <BookBerlangsungIcon />
            ) : filterStatus === "Selesai" ? (
              <BookSelesaiIcon />
            ) : (
              <BookDibatalkanIcon />
            )}
          </div>
          <div className="flex flex-col w-fit justify-between ml-4">
            <div className="flex w-full justify-between text-base items-center gap-x-4">
              <span className="text-gray-500">{currDate}</span>
              <span className="text-primary font-medium">
                {status}
              </span>
            </div>
            <span className="flex w-full font-semibold text-primary">
              {title}
            </span>
            {slotId && (
              <span className="text-sm text-gray-600">
                Slot ID: {slotId}
              </span>
            )}
            {platNomor && (
              <span className="text-sm text-gray-600">
                Plat: {platNomor}
              </span>
            )}
          </div>
        </div>
        <Button
          // href={href}
          onClick={ () => { router.push(`booking/detail/${parkingId}?type=${bookingType}`)}}
          className="w-[30%] py-1 flex justify-center bg-primary text-white rounded-lg"
        >
          Lihat
        </Button>
      </div>
    );
  }

  function AddBook() {
    return (
      <button
        onClick={() => router.push("/admin/monitoring")}
        className="bg-primary rounded-full flex p-[12px] fixed bottom-[10%] right-[3%]"
      >
        <div className="size-12">
          <PlusIcon />
        </div>
      </button>
    );
  }

  return (
    <main className="w-full h-full flex bg-white-smoke min-h-screen">
      <Sidebar active={1} />
      <div className="w-full h-full flex flex-col bg-white m-[4%] mt-[10%] p-[4%] text-gray-900 text-xl">
        <div className="flex w-full">
          <span
            onClick={() => setFilterStatus("Berlangsung")}
            className={`cursor-pointer flex w-fit text-primary font-bold text-2xl divide-y-2 pb-2 lg:ml-[5%] ${
              filterStatus === "Berlangsung" ? "border-b-4 border-primary " : ""
            }`}
          >
            Berlangsung
          </span>
          <span
            onClick={() => setFilterStatus("Selesai")}
            className={`cursor-pointer flex w-fit text-primary font-bold text-2xl divide-y-2 pb-2 lg:ml-[5%] ${
              filterStatus === "Selesai" ? "border-b-4 border-primary " : ""
            }`}
          >
            Selesai
          </span>
          <span
            onClick={() => setFilterStatus("Dibatalkan")}
            className={`cursor-pointer flex w-fit text-primary font-bold text-2xl divide-y-2 pb-2 lg:ml-[5%] ${
              filterStatus === "Dibatalkan" ? "border-b-4 border-primary " : ""
            }`}
          >
            Dibatalkan
          </span>
        </div>
        <div className="flex flex-wrap justify-around gap-y-4">
          {bookData
            ?.filter((item) => {
              // Cek apakah booking sudah selesai berdasarkan status slot
              const slotData = item.slotParkir || item.slot_parkir;
              const isSelesai = slotData?.status === "Terisi" && 
                filterStatus.toLowerCase() === "selesai";
              
              // Cek apakah booking dibatalkan berdasarkan waktu_booking_berakhir
              const isDibatalkan =
                item.waktu_booking_berakhir?.includes("1970") &&
                filterStatus.toLowerCase() === "dibatalkan";

              switch (filterStatus) {
                case "Selesai":
                  return isSelesai;
                case "Dibatalkan":
                  return isDibatalkan;
                default:
                  // Berlangsung: slot status Dibooking dan tidak dibatalkan
                  return slotData?.status === "Dibooking" && !isDibatalkan;
              }
            })
            ?.map((data, index) => {
              // Tentukan status berdasarkan kondisi data
              const slotData = data.slotParkir || data.slot_parkir;
              let currentStatus = "Berlangsung";
              if (slotData?.status === "Terisi") {
                currentStatus = "Selesai";
              } else if (data.waktu_booking_berakhir?.includes("1970")) {
                currentStatus = "Dibatalkan";
              }
              
              return (
                <BookCard
                  key={index}
                  date={new Date(data.waktu_booking)}
                  title={slotData?.blok?.nama || 'Unknown'}
                  parkingId= {data?.id}
                  slotId={slotData?.id || data?.id_slot}
                  platNomor={data?.plat_nomor}
                  bookingType={data?.bookingType}
                  status={currentStatus}
                />
              );
            })}
          {/* <BookCard /> */}
          <div className="flex flex-col min-w-fit self-start w-full lg:w-2/5"></div>
          {/* BookCard */}
        </div>
      </div>
      <AddBook />
    </main>
  );
}
