"use client";

import Navbar from "@components/Navbar";
import Actionbar from "@/app/_components/Actionbar";

export default function Home() {
    const parkingStatus = [
        {
            title: "Kosong",
            className: ' bg-white border-primary border-2 '
        },
        {
            title: "Dipilih",
            className: ' bg-primary border-primary border-2 '
        },
        {
            title: "Terisi",
            className: ' bg-gray-300 '
        },
    ]

    function slotBox({status, className}){
        return(
            <div className={"h-[36px] w-[36px] " + className}>
                {/* BOX */}
            </div>
        )
    }

    function slotParking({availableData, selected}){
        return(
            {
                // 
            }
        )
    }

  return (
    <main className="bg-white-smoke h-screen justify-center flex flex-wrap pt-6 overflow-y-auto">
      <Actionbar 
      title={"Blok"}
      />

      <div className=" flex justify-around h-fit w-full mt-20">
        {
            parkingStatus.map( (status, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className={ 'h-[24px] w-[24px] ' + status.className }>
                    </div>
                    <span className=" text-2xl font-medium text-black">
                        {status.title}
                    </span>
                </div>
            ))
        }
      </div>

      <Navbar />
    </main>
  );
}
