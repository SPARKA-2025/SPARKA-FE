"use client";
import LahanTersediaIcon from "/public/assets/icon/lahan-tersedia.svg";
import SedangParkirIcon from "@icon/sedang-parkir.svg";
import SelesaiParkirIcon from "@icon/selesai-parkir.svg";
import TotalParkirIcon from "@icon/total-parkir.svg";
import DibookingIcon from "@icon/dibooking.svg";
import fetchApi from "../lib/fetch/fetchApi";

import Sidebar from "@components/Sidebar";
import { useState, useEffect } from "react";

export default function Main() {
  const [contentList, setContentList] = useState([]);

  useEffect(() => {
    fetchApi({
      endpoint: "/admin/slot-parkir/get-total-slot-parkir",
    }).then((res) => {
      const {
        slot_kosong: slotKosong,
        total_slot: totalSlot,
        slot_terisi: slotTerisi,
        slots_dibooking: slotDiboking,
        slot_selesai: slotSelesai
      } = res;

      setContentList([
        {
          icon: LahanTersediaIcon,
          color: "#4859F5",
          label: "Lahan Tersedia",
          value: slotKosong?.split("/")[0] || 0,
        },
        {
          icon: SedangParkirIcon,
          color: "#F5BA48",
          label: "Sedang Parkir",
          value: slotTerisi,
        },
        {
          icon: SelesaiParkirIcon,
          color: "#2EAA3A",
          label: "Selesai Parkir",
          value: slotSelesai,
        },
        {
          icon: DibookingIcon,
          color: "#FF0000",
          label: "Dibooking",
          value: slotDiboking,
        },
        {
          icon: TotalParkirIcon,
          color: "#20276A",
          label: "Total Data Parkir",
          value: totalSlot,
        },
      ]);
    });
  }, []);

  return (
    <main className="bg-white-smoke h-screen justify-center flex flex-wrap pt-6 overflow-y-auto">
      <div className="w-full h-auto mt-[8%] mx-[8%] flex flex-wrap justify-evenly gap-1">
        {contentList.map((key, index) => (
          <div
            key={index}
            className="bg-white shadow-md px-6 py-10 min-w-[256px] w-fit h-fit flex flex-col gap-4 items-center justify-center mr-auto"
          >
            <div
              className={` rounded-full  p-2  w-[32%] min-w-[64px]`}
              style={{ backgroundColor: key.color }}
            >
              <key.icon />
            </div>
            <span className="text-primary font-bold text-6xl">{key.value}</span>
            <span className="text-gray-700 font-bold text-2xl text-center">
              {key.label}
            </span>
          </div>
        ))}
      </div>
      <Sidebar />
    </main>
  );
}
