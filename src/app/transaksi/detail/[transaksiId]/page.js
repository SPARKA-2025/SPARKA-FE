"use client";

import Logo from "/public/assets/icon/logo.svg";
import { Button } from "@mui/base";

export default function Home() {
  return (
    <main className="bg-white-smoke h-screen justify-center flex flex-wrap pt-6 overflow-y-auto">
      <div className="bg-white my-11 mx-16 w-full flex flex-col items-center flex-wrap rounded-2xl justify-evenly">
          <div className="w-[200px] h-[200px]"><Logo /></div>
          <span className="text-primary font-semibold text-xl">
            Booking Berhasil
          </span>

        <div className="text-gray-400 font-medium flex flex-col justify-around px-[4%] w-full h-[32%] mb-8">
          <span>Tanggal</span>
          <span>Nomor Transaksi</span>
          <hr />
          <span>Nomor Plat</span>
          <span>Nama Pemesan</span>
          <span>Jenis Mobil</span>
          <span>Pilih Waktu</span>
          <span>Tempat Parkir</span>
        </div>

        <Button
          href="/"
          variant="contained"
          color="primary"
          className="bg-primary w-[92%] mx-[4%] h-[6%] rounded-xl justify-center items-center flex"
        >
          Ok
        </Button>
        <span className="text-primary font-semibold text-lg">
            Bagikan bukti transaksi
          </span>
      </div>
    </main>
  );
}
