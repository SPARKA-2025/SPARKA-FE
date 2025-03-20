"use client";

import Navbar from "@components/Navbar";
import SearchBar from "@components/Searchbar";
import Card from "@components/Card";
import Actionbar from "../_components/Actionbar";
import { useState } from "react";

export default function Home() {
  const [transactionState, setTransactionState] = useState(false);

  function TransaksiTab() {
    let isInProgress = " text-primary",
      isDone = " text-primary";
    if (transactionState) {
      isInProgress = " bg-primary rounded-l-lg";
    } else {
      isDone = " bg-primary  rounded-r-lg";
    }
    return (
      <div className=" w-auto h-12 rounded-lg bg-gray-400 bg-opacity-50 items-center flex mx-[8%] mt-12">
        <button
          onClick={() => setTransactionState(!transactionState)}
          className={
            "w-[50%] flex justify-center h-full items-center text-lg font-bold " +
            isInProgress
          }
        >
          Berlangsung
        </button>
        <button
          onClick={() => setTransactionState(!transactionState)}
          className={
            "w-[50%] flex justify-center h-full items-center text-lg font-bold " +
            isDone
          }
        >
          Selesai
        </button>
      </div>
    );
  }

  function ClearedOrder() {
    return <div className="mt-12 bg-black h-28">Ini</div>;
  }

  return (
    <main className="bg-white-smoke h-screen justify-center flex flex-wrap pt-6 overflow-y-auto items-center">
      <Actionbar title={"pesanan"} icon={false} textAlign="left" />
      <div className=" w-full h-[90%] items-center ">
        <TransaksiTab />
        {transactionState ? (
            <div>
                </div>
        ) : (
            <div>
                        <ClearedOrder />

            </div>
        )}
      </div>

      <Navbar active={1} />
    </main>
  );
}
