"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "@components/Sidebar";
import { Button } from "@mui/material";
import StatusList from "@/app/_components/StatusList";
import fetchApi from "@/app/lib/fetch/fetchApi";
import Hls from "hls.js";
import ZoominIcon from "@icon/zoom-in.svg";
import ZoomoutIcon from "@icon/zoom-out.svg"
import SlotArea from "@/app/_components/SlotArea";
import { useRouter } from "next/navigation";

export default function Main({ params }) {
  const [slotActive, setSlotActive] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [partData, setPartData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [gatewayData, setGatewayData] = useState([]);
  const [cctvData, setCctvData] = useState([]);
  const [activeMap, setActiveMap] = useState(null);
  const [activeCam, setActiveCam] = useState({
    url: 'http:///34.128.83.137:8080/hls/ruang_1a/index.m3u8'
  });
  const { areaId, zoneId } = params;

  const [camZoom, setCamZoom] = useState(false)
  const [player, setPlayer] = useState(null);
  const videoElement = React.createRef();

  const router = useRouter()

  // Fetch part data
  useEffect(() => {
    fetchApi({
      method: "get",
      endpoint: `/part/${zoneId}/get-parts-data`,
    }).then((resp) => {
      setPartData(resp);
      setActiveMap(resp[0]); // Default part map
    });
  }, []);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(activeCam?.url);
      hls.attachMedia(videoElement.current);
      setPlayer(hls);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCam, showCamera]);

    useEffect(() => {
      if (videoElement.current) {
        videoElement.current.play();
      }
    }, [videoElement]);

  useEffect(() => {
    console.log(slotActive)
    if(slotActive?.id?.includes('cctv')) setActiveCam(slotActive)
  }, [slotActive]);

  // Fetch data for slots, gateways, and CCTV based on the active map
  useEffect(() => {
    if (activeMap?.id) {
      fetchApi({
        method: "get",
        endpoint: `/slot-parkir/${activeMap.id}/${zoneId}/get-slot-on-part`,
      }).then((resp) => setSlotData(resp.slots));

      fetchApi({
        method: "get",
        endpoint: `/gateway/${activeMap.id}/${zoneId}/get-gateway-on-part`,
      }).then((resp) => {
        console.log(`gateway:\n\n${JSON.stringify(resp.cctvs)}`);
        setGatewayData(resp.cctvs);
      });

      fetchApi({
        method: "get",
        endpoint: `/cctv/${activeMap.id}/${zoneId}/${areaId}/get-cctv-on-part`,
      }).then((resp) => {
        console.log(`cctv:\n\n${JSON.stringify(resp.cctvs)}`)
        const data = resp.cctvs
        setCctvData(data)
        setActiveCam({
          id: 'cctv-' + data[0].id,
          ...data[0]
        })
      });
    }
  }, [activeMap]);

  const handleSlotClick = (blockData) => {
    setSlotActive(blockData)
  }

  const youtubeLoopSrc = (url) => {
    if (!url) return null;
  
    if (url.includes("https://youtube.com/live/")) {
      // Ambil videoId dari URL
      const videoId = url.split("/live/")[1]?.split("?")[0];
      
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0`;
    }
  
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}?playlist=${videoId}&autoplay=1&mute=1&controls=0`;
    }
  
    return null;
  };
  
  
  return (
    <main className="bg-[#EDEEF0] h-fit w-full flex flex-col overflow-y-auto pt-[10%]">
      <div className="flex flex-col w-full h-screen justify-between px-[2%] pb-[10%]">
        <div className="flex w-full justify-between">
          <div className="w-[50%]">
            <StatusList />
          </div>
          <div
            onClick={() => {
              router.push(`${zoneId}/edit`);
            }}
            className="bg-primary active:bg-blue-600 cursor-pointer rounded-md text-white font-semibold text-center items-center py-2 w-[4vw] h-full"
          >
            Edit
          </div>
        </div>

        {/* Navigation for Maps */}
        <div className="text-primary font-semibold gap-4 flex justify-center">
          {partData?.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMap(item)}
              className={`cursor-pointer ${
                activeMap?.id === item.id ? "border-b-4 border-primary" : ""
              }`}
            >
              {item.nama}
            </div>
          ))}
        </div>

        {/* Grid Display */}
        <div className="flex pb-16 relative aspect-video justify-start items-center overflow-auto w-[100%] h-full self-end">
          <SlotArea
            gridRows={activeMap?.row || 2}
            gridColumns={activeMap?.column || 2}
            gatewayData={gatewayData}
            cctvData={cctvData}
            // onDragOver={handleDragOver}
            // onDrop={handleDrop}
            slotData={slotData}
            // onDragStart={handleDragStart}
            onBlockClick={handleSlotClick}
            activeBlock={slotActive}
            toogleData={{ showCctv: showCamera }}
            editMode={false}
          />
        </div>

        {/* Interaction Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="contained"
            style={{
              backgroundColor: showCamera ? "#FF0000" : "#142b6f",
            }}
            onClick={() => setShowCamera(!showCamera)}
          >
            {showCamera ? "Close Camera" : "View Camera"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!slotActive || slotActive.status !== "Kosong"}
            href={`/admin/booking/${slotActive?.id}`}
          >
            Booking
          </Button>
        </div>
      </div>

      {showCamera && (
        <div
          className={`fixed flex bottom-12 right-12 bg-slate-500 shadow-2xl rounded-lg z-20 ${
            camZoom ? "h-4/5" : "h-1/5"
          }`}
        >
          <div className="absolute flex hover:opacity-100 opacity-0 h-full w-full bg-black bg-opacity-50 z-20 rounded-l">
            <div
              className={`flex w-6 absolute text-white hover:cursor-pointer z-10 ${
                camZoom
                  ? "bottom-[4%] right-[2%] w-8"
                  : "top-[6%] left-[2%] w-6"
              }`}
              onClick={() => setCamZoom(!camZoom)}
            >
              {camZoom ? <ZoominIcon /> : <ZoomoutIcon />}
            </div>
            <div className="flex h-full w-full absolute justify-center items-center">
              Layar Penuh
            </div>
          </div>
          {/* HSL */}

          {/* <video
            ref={videoElement}
            width="100%"
            height="100%"
            playsInline
            autoPlay
            muted
            className="flex justify-center rounded-lg"
          /> */}

          <iframe
            width="100%"
            height="100%"
            src={ youtubeLoopSrc(activeCam?.url) }
          ></iframe>
        </div>
      )}

      <Sidebar active={2} />
    </main>
  );
}
