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
      setBookData([ ...parkir, ...parkir_khusus]);
      console.log(res);
    });
  }, []);

  function BookCard({
    date = new Date(Date.now()),
    title = "Parkiran Depan Digital Center UNNES",
    parkingId = "#",
    status = "Berlangsung",
  }) {
    const currDate = date.toDateString();
    return (
      <div className="flex flex-col min-w-fit self-start w-full lg:w-2/5 items-end bg-white shadow-xl border-primary p-5 lg:p-[2%] rounded-md">
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
              <span className="text-primary font-medium">{filterStatus}</span>
            </div>
            <span className="flex w-full font-semibold text-primary">
              {title}
            </span>
          </div>
        </div>
        <Button
          // href={href}
          onClick={ () => { router.push(`booking/detail/${parkingId}`)}}
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
              const isSelesai =
                item.status?.includes("Selesai") &&
                filterStatus.toLowerCase() === "selesai";
              const isDibatalkan =
                item.waktu_booking_berakhir?.includes("1970") &&
                filterStatus.toLowerCase() === "dibatalkan";

              switch (filterStatus) {
                case "Selesai":
                  return isSelesai;
                case "Dibatalkan":
                  return isDibatalkan;
                default:
                  return !isSelesai && !isDibatalkan;
              }
            })
            ?.map((data, index) => (
              <BookCard
                key={index}
                date={new Date(data.waktu_booking)}
                title={data.slot__parkir.blok.nama}
                parkingId= {data?.id}
              />
            ))}
          {/* <BookCard /> */}
          <div className="flex flex-col min-w-fit self-start w-full lg:w-2/5"></div>
          {/* BookCard */}
        </div>
      </div>
      <AddBook />
    </main>
  );
}
