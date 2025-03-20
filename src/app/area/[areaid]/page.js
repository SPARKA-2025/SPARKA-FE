'use client'

import Navbar from "@components/Navbar";
import Card from "@/app/_components/Card";
import MapIframe from "@components/MapIframe";

export default function Home() {
  return (
    <main className="bg-white-smoke h-screen justify-center flex flex-wrap pt-6 overflow-y-auto">
      <MapIframe
      longitude={-7.051231754190722}
      latitude={110.39383134421844}
      title={"parking zone"}
      className={"w-full h-1/5 min-h-[224px] flex"}
      />

      <div className="w-[80%] mt-8 mb-16">
      <Card href="blok/lab_bio"/>
      <Card href="blok/lab_bio" />
      <Card href="blok/lab_bio" />
      <Card href="blok/lab_bio" />
      <Card href="blok/lab_bio" />
      <Card href="blok/lab_bio" />
      </div>

      <Navbar />
    </main>
  );
}
