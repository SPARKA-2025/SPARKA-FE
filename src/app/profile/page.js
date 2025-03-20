"use client";

import Navbar from "@components/Navbar";
import SearchBar from "@components/Searchbar";
import Card from "@components/Card";
import Star from "/public/assets/icon/star.svg";
import ProfileIcon from "/public/assets/icon/profile.svg"

export default function Home() {
  return (
    <main className="bg-white-smoke h-screen justify-center flex flex-wrap pt-6 overflow-y-auto">
        <div className=" w-full flex justify-center items-center">
            <div className=" h-[40%]">
            <ProfileIcon
            className="fill-current text-white w-auto h-[120%] bg-primary rounded-full"  />
            </div>
        </div>
      <div className="text-gray-400 font-medium flex flex-col justify-around px-[4%] w-full h-[16%] divide-y-4">
        <div className="flex flex-col justify-around">
          <div className=" flex w-full items-center gap-2">
            <Star />
            <span>Favorit</span>
          </div>
          <div className=" flex w-full items-center gap-2">
            <Star />
            <span>Disimpan</span>
          </div>
        </div>
        <div className="flex flex-col justify-around">
          <div className=" flex w-full items-center gap-2">
            <Star />
            <span>Bahasa</span>
          </div>
          <div className=" flex w-full items-center gap-2">
            <Star />
            <span>Mode Gelap</span>
          </div>
        </div>
      </div>

      <Navbar active={2} />
    </main>
  );
}
