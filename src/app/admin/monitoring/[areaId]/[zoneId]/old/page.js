"use client";

import Sidebar from "@components/Sidebar";
import { Button } from "@mui/material";
import StatusList from "@/app/_components/StatusList";
import statusEnum from "@/app/lib/utils/enum/statusEnum";
// import slotDataDummy from "@/app/lib/utils/dummy/slotData";
import React, { useEffect, useState } from "react";
import cctvDataDummy from "@/app/lib/utils/dummy/cctvData";
import fetchApi from "@/app/lib/fetch/fetchApi";
import Hls from "hls.js";
import ZoominIcon from "@icon/zoom-in.svg";
import ZoomoutIcon from "@icon/zoom-out.svg"

export default function Main({params}) {
  const [slotActive, setSlotActive] = useState(-1);
  const [showCamera, setShowCamera] = useState(false);
  const [activeCamera, setActiveCamera] = useState({
    spot: 0,
    device: 0,
  });
  const [partData, setPartData] = useState([])
  const [slotData, setSlotData] = useState([]);
  const [cctvData, setCctvData] = useState(cctvDataDummy)
  const [activeMap, setActiveMap] = useState('Depan')
  const [camZoom, setCamZoom] = useState(false);

  const [videoUrl, setVideoUrl] = useState('http:///34.128.83.137:8080/hls/ruang_1a/index.m3u8');
  const [player, setPlayer] = useState(null);
  const videoElement = React.createRef();

  const {areaId, zoneId} = params

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement.current);
      setPlayer(hls);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl, showCamera]);

  useEffect(() => {
    if (videoElement.current) {
      videoElement.current.play();
    }
  }, [videoElement]);

  useEffect( () => {
    fetchApi({
      method: "get",
      endpoint: `/part/${zoneId}/get-parts-data`,
    }).then((resp) => {
      setPartData(resp)
      setActiveMap(resp[0])
    });
  }, [])

  useEffect(() => {
    if (activeMap.id >= 0) {
      fetchApi({
        method: "get",
        endpoint: `/slot-parkir/${activeMap.id}/${zoneId}/get-slot-on-part`,
        contentType: "application/json",
      }).then((resp) => {
        setSlotData(resp.slots);
      });
    }

    // fetchApi({
    //   method: "get",
    //   endpoint: `/admin/blok/${areaId}/${zoneId}/get-cctv-data`,
    // }).then((resp) => {
    //   setCctvData(resp.data);
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMap]);

  // useEffect( () => {
  //   setVideoUrl(activeCamera.url)
  // }, [activeCamera])

  // function nextCam() {
  //   const { spot: currSpot, device: currDevice } = activeCamera;

  //   let nextActive = {
  //     spot: currSpot,
  //     device: currDevice + 1,
  //   };

  //   const isMaxSpot = currSpot >= cctvData.length - 1;
  //   const isMaxDevice =
  //     activeCamera.device >= cctvData[currSpot].camera.length - 1;

  //   if (isMaxDevice)
  //     nextActive = {
  //       spot: currSpot + 1,
  //       device: 0,
  //     };

  //   if (isMaxSpot && isMaxDevice)
  //     nextActive = {
  //       spot: 0,
  //       device: 0,
  //     };

  //   setActiveCamera(nextActive);
  // }

  // function previousCam() {
  //   const { spot: currSpot, device: currDevice } = activeCamera;

  //   let prevActive = {
  //     spot: currSpot,
  //     device: currDevice - 1,
  //   };

  //   const isMinSpot = currSpot <= 0;
  //   const isMinDevice = currDevice <= 0;

  //   if (isMinSpot && isMinDevice)
  //     prevActive = {
  //       spot: cctvData.length - 1,
  //       device: cctvData[cctvData.length - 1].camera.length - 1,
  //     };
  //   else if (isMinDevice)
  //     prevActive = {
  //       spot: currSpot - 1,
  //       device: cctvData[currSpot - 1].camera.length - 1,
  //     };

  //   setActiveCamera(prevActive);
  // }

  function SlotBox({ status, x = 0, y = 0, id }) {
    switch (status) {
      case "Terisi":
        status = 2;
        break;
      case "Dibooking":
        status = 3;
        break;
      default:
        status = 0;
        break;
    }

    const isActive = id === slotActive?.id;
    const handleClick = () => {
      isActive ? setSlotActive(-1) : setSlotActive({ id, status });
    };

    const styles = {
      backgroundColor: isActive
        ? statusEnum[1].style.color
        : statusEnum[status].style.color,
      borderColor: isActive
        ? statusEnum[1].style.border
        : statusEnum[status].style.border,
      gridRow: y,
      gridColumn: x,
    };

    return (
      <button
        style={styles}
        onClick={handleClick}
        className="rounded-md border-2 size-auto max-h-12 min-h-6 min-w-6 aspect-square"
      ></button>
    );
  }

  function CctvSpot({ x, y, spot }) {
    const styles = {
      gridRow: y,
      gridColumn: x,
    };
    const isActive = spot === activeCamera?.spot;
  
    const handleClick = () => {
      const isSpot = activeCamera?.spot === spot;
      const totalDevicesInSpot = cctvData.filter(cam => cam.x === x && cam.y === y).length + 1;
  
      if (isSpot) {
        const device = (activeCamera?.device + 1) % totalDevicesInSpot;
        setActiveCamera({
          spot,
          device
        });
      } else {
        setActiveCamera({
          spot,
          device: 0,
        });
      }
    };
  
    const activeCameraData = cctvData.find(
      (cam, index) => cam.x === x && cam.y === y && index === activeCamera.device
    );
  
    return (
      <div
        style={styles}
        className="relative flex justify-center items-center size-auto"
      >
        {isActive && activeCameraData ? (
          <div
            style={{
              transform: `rotate(${activeCameraData?.angle - 45}deg)`,
              transformOrigin: "bottom left",
            }}
            className="size-[400%] animate-pulse bg-red-300 absolute rounded-tr-full bottom-1/2 left-1/2 transform opacity-80"
          ></div>
        ) : (
          <div className="size-[60%] rounded-full bg-red-500 animate-ping absolute opacity-75"></div>
        )}
  
        <button
          onClick={handleClick}
          className="size-[50%] rounded-full bg-red-500 relative"
        ></button>
      </div>
    );
  }

  return (
    <main className="bg-[#EDEEF0] h-fit w-full justify-start flex flex-col overflow-y-auto pt-[10%]">
      <div className="flex flex-col w-full h-screen justify-between px-[2%] pb-[10%]">
        <StatusList />
        {/* Parking */}
        <div className="text-primary font-semibold gap-4 flex justify-center">
          {
            partData.map( (item, index) => (
              <div
              key={item.nama}
              onClick={() => setActiveMap(item)}
              className={`flex ${
                activeMap?.id === item?.id ? "border-b-4" : ""
              } border-primary cursor-pointer`}
            >
              {item.nama}
            </div>
            ))
          }
        </div>
        <div className="w-fit min-w-[600px] min-h-fit h-[40%] grid auto-cols-auto auto-rows-auto gap-1 lg:gap-4 md:gap-6 mx-[2%] self-center p-6 border border-black border-1 rounded-3xl">
          {Boolean(slotData) &&
            slotData?.map((slot, index) => (
              <SlotBox
                key={index}
                status={slot.status}
                x={slot.x}
                y={slot.y}
                id={slot.id}
              />
            ))}
          {showCamera &&
            cctvData?.map((camera, index) => (
              <CctvSpot key={index} x={camera.x} y={camera.y} spot={index} />
            ))}
        </div>

        {/* Interact */}
        <div className="flex flex-col w-full">
          <div className="justify-center w-full h-fit flex">
            <Button
              variant="contained"
              color="primary"
              className="bg-primary w-full m-5 h-fit px-2 py-3 lg:px-3 lg:py-5 lg:text-lg lg:font-semibold rounded-md"
              style={{
                backgroundColor: showCamera ? "#FF0000" : "#142b6f",
              }}
              onClick={() => {
                setShowCamera(!showCamera);
                setActiveCamera({
                  spot: 0,
                  device: 0,
                });
                setCamZoom(false);
              }}
            >
              View Live Camera
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="bg-primary w-full m-5 h-fit px-2 py-3 lg:px-3 lg:py-5 lg:text-lg lg:font-semibold rounded-md"
              disabled={slotActive?.status !== 0}
              href={`/admin/booking/${slotActive?.id}`}
            >
              Booking
            </Button>
          </div>
        </div>
      </div>
      {showCamera && (
        <div className={`fixed flex bottom-12 right-12 bg-white shadow-2xl rounded-lg ${camZoom ? 'h-4/5' : 'h-1/5'}`}>
          <div className="absolute flex hover:opacity-100 opacity-0 h-full w-full bg-black bg-opacity-50 z-20 rounded-l">
            <div
              className={`flex w-6 absolute text-white hover:cursor-pointer z-10 ${
                camZoom ? "bottom-[4%] right-[2%] w-8" : "top-[6%] left-[2%] w-6"
              }`}
              onClick={() => setCamZoom(!camZoom)}
            >
              {camZoom ? <ZoominIcon /> : <ZoomoutIcon />}
            </div>
            <div className="flex h-full w-full absolute justify-center items-center">
              Layar Penuh
            </div>
          </div>
          <video
            ref={videoElement}
            width="100%"
            height="100%"
            playsInline
            autoPlay
            muted
            className="flex justify-center rounded-lg"
          />
        </div>
      )}
      <Sidebar active={2} />
    </main>
  );
}