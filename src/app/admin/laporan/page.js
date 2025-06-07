"use client";

import Sidebar from "@components/Sidebar";
import { useState, useEffect } from "react";
import fetchApi from "@/app/lib/fetch/fetchApi";
import Image from "next/image";

export default function Main() {
  const [log, setLog] = useState([]);
  const [image, setImage] = useState(false);

  useEffect(() => {
    fetchApi({
      endpoint: "/admin/get-log-kendaraan",
    }).then((res) => {
      setLog(res.data);
    });
  }, []);

  function ImageModal() {
    return (
      <div
        onClick={() => setImage(false)}
        className="w-screen h-screen fixed z-10 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className=" w-[400px] h-[280px] lg:w-[700px] lg:h-[500px] border-slate-500 border relative">
          <Image fill alt="capture" src={`data:image/png;base64,${image}`} />
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white-smoke h-screen justify-center flex relative flex-wrap pt-6 overflow-y-auto">
      {image && <ImageModal />}
      <div className="w-full h-full block bg-white m-[4%] mt-[10%] p-[4%] text-gray-900 text-base">
        <span className="text-primary font-bold text-2xl divide-y-2">
          Laporan Parkir
          <hr className="h-px my-8 bg-gray-700 border-0 dark:bg-gray-700" />
        </span>
        <div className="w-full overflow-x-auto">
      <table className="w-full border-gray-300">
        <thead className="border-y-2 border-gray-300">
          <tr>
            <th className="px-4 py-2">No.</th>
            <th className="px-4 py-2">Capture Time</th>
            <th className="px-4 py-2">Exit Time</th>
            <th className="px-4 py-2">Vehicle</th>
            <th className="px-4 py-2">Plate Number</th>
            <th className="px-4 py-2">Gambar</th>
          </tr>
        </thead>
        <tbody>
          {log?.map((item, index) => (
            <tr key={index} className="hover:bg-slate-200">
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td className="px-4 py-2 text-center">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-center">
                {item.exit_time ? new Date(item.exit_time).toLocaleDateString() : '-'}
              </td>
              <td className="px-4 py-2 text-center">{item.vehicle}</td>
              <td className="py-2 text-center">{item.plat_nomor}</td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => setImage(item.image)}
                  className="text-sky-500 cursor-pointer"
                >
                  <u>Lihat Gambar</u>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>      </div>
      <Sidebar active={3} />
    </main>
  );
}
