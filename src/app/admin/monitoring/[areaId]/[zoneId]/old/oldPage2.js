"use client";

import Sidebar from "@components/Sidebar";
import { Button } from "@mui/material";
import StatusList from "@/app/_components/StatusList";
import fetchApi from "@/app/lib/fetch/fetchApi";
import React, { useEffect, useState } from "react";
import ZoominIcon from "@icon/zoom-in.svg";
import ZoomoutIcon from "@icon/zoom-out.svg";
import Hls from "hls.js";
import SlotArea from "../../../../_components/SlotArea";

export default function Main({ params }) {
  const [slotActive, setSlotActive] = useState(-1);
  const [showCamera, setShowCamera] = useState(false);
  const [activeMap, setActiveMap] = useState(null);
  const [partData, setPartData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [gatewayData, setGatewayData] = useState([]);
  const [cctvData, setCctvData] = useState([]);
  const [camZoom, setCamZoom] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  const videoElement = React.createRef();
  const { areaId, zoneId } = params;

  useEffect(() => {
    fetchApi({
      method: "get",
      endpoint: `/part/${zoneId}/get-parts-data`,
    }).then((resp) => {
      setPartData(resp);
      setActiveMap(resp[0]);
    });
  }, []);

  useEffect(() => {
    if (activeMap?.id) {
      // Fetch Slot Data
      fetchApi({
        method: "get",
        endpoint: `/slot-parkir/${activeMap.id}/${zoneId}/get-slot-on-part`,
      }).then((resp) => {setSlotData(resp.slots); console.log(resp)});

      // Fetch CCTV Data
      fetchApi({
        method: "get",
        endpoint: `/cctv/${activeMap.id}/${zoneId}/${areaId}/get-cctv-on-part`,
      }).then((resp) => setCctvData(resp.cctvs));

      // Fetch Gateway Data
      fetchApi({
        method: "get",
        endpoint: `/gateway/${activeMap.id}/${zoneId}/get-gateway-on-part`,
      }).then((resp) => setGatewayData(resp.gateways));
    }
  }, [activeMap]);

  useEffect(() => {
    if (Hls.isSupported() && videoUrl) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement.current);
    }
  }, [videoUrl]);

  return (
    <main className="bg-[#EDEEF0] h-fit w-full flex flex-col overflow-y-auto pt-[10%]">
      <div className="flex flex-col w-full h-screen justify-between px-[2%] pb-[10%]">
        <StatusList />
        {/* Pemetaan Part */}
        <div className="text-primary font-semibold gap-4 flex justify-center">
          {partData.map((item) => (
            <div
              key={item.nama}
              onClick={() => setActiveMap(item)}
              className={`flex cursor-pointer ${
                activeMap?.id === item?.id ? "border-b-4 border-primary" : ""
              }`}
            >
              {item.nama}
            </div>
          ))}
        </div>

        {/* Slot Area */}
        <div className="self-center">
          <SlotArea
            gridRows={activeMap?.row || 2}
            gridColumns={activeMap?.column || 2}
            slotData={slotData}
            gatewayData={gatewayData}
            cctvData={cctvData}
            toogleData={{ showCctv: showCamera, deleteMode: false }} // Non-edit mode
            onDragStart={() => {}} // Non-editable
            onDragOver={() => {}} // Non-editable
            onDrop={() => {}} // Non-editable
            onBlockClick={(block) => {setSlotActive(block)}} // Handle Slot Click
            activeBlock={slotActive}
          />
        </div>

        {/* Interaksi Tombol */}
        <div className="flex justify-center gap-4">
          <Button
            variant="contained"
            style={{
              backgroundColor: showCamera ? "#FF0000" : "#142b6f",
            }}
            onClick={() => {
              setShowCamera(!showCamera);
              setVideoUrl("http:///34.128.83.137:8080/hls/ruang_1a/index.m3u8");
            }}
          >
            {showCamera ? "Tutup Kamera" : "Lihat Kamera"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!slotActive?.id || slotActive?.type !== "slot"} // Tombol aktif hanya jika slot valid dipilih
            href={`/admin/booking/${slotActive?.id}`}
          >
            Booking
          </Button>
        </div>
      </div>

      {/* Tampilan Kamera */}
      {showCamera && (
        <div
          className={`fixed bottom-12 right-12 bg-white shadow-2xl rounded-lg ${
            camZoom ? "h-4/5" : "h-1/5"
          }`}
        >
          <div
            className="absolute hover:opacity-100 opacity-0 h-full w-full bg-black bg-opacity-50 z-20 rounded-l"
            onClick={() => setCamZoom(!camZoom)}
          >
            <div
              className={`absolute ${
                camZoom ? "bottom-[4%] right-[2%]" : "top-[6%] left-[2%]"
              }`}
            >
              {camZoom ? <ZoominIcon /> : <ZoomoutIcon />}
            </div>
          </div>
          <video
            ref={videoElement}
            playsInline
            autoPlay
            muted
            className="w-full h-full rounded-lg"
          />
        </div>
      )}

      <Sidebar active={2} />
    </main>
  );
}
