import React, { useEffect, useMemo, useState } from "react";
import SlotBox from "./SlotBox";
import Gateway from "./Gateway";
import CctvSpotEdit from "./CctvSpot";
import getPositionTransform from "@/app/lib/utils/handler/getPositionTransform";

export default function SlotArea({
  slotData = [],
  gatewayData = [],
  cctvData = [],
  gridRows,
  gridColumns,
  onDragStart,
  onDrop,
  onDragOver,
  onBlockClick,
  activeBlock,
  toogleData,
  editMode=false
}) {
  const totalBlock = gridRows * gridColumns;
  const { showCctv, deleteMode=false } = toogleData;

  const gridArray = useMemo(() => {
    return Array.from({ length: totalBlock }, (_, index) => {
      const x = index % gridColumns;
      const y = Math.floor(index / gridColumns);

      const slot = slotData.find(
        (item) => (parseInt(item.x) - 1) === x && (parseInt(item.y) - 1) === y
      );
      const gateway = gatewayData.find(
        (item) => (parseInt(item.x) - 1) === x && (parseInt(item.y) - 1) === y
      );
      // const cctv = cctvData.find(
      //   (item) => parseInt(item.x) === x && parseInt(item.y) === y
      // );

      if (gateway) return { type: "gateway", data: {...gateway}, id: `gateway-${gateway.id}` };
      if (slot) return { type: "slot", data: {...slot, id: `slot-${slot.id}`} };
      // if (cctv) return { type: "cctv", data: cctv };

      return { type: "empty", data: { id: `empty-${x}-${y}` } };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotData, gatewayData, gridRows, gridColumns]);

  return (
    <div className="block mx-[2%] mt-[1%] mb-5 border-2 border-primary rounded-lg relative w-fit h-fit max-w-[80vw] max-h-[70vh] overflow-visible" style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}>
      <div
        className="grid gap-2 p-2 overflow-visible"
        style={{
          gridTemplateRows: `repeat(${gridRows}, minmax(32px, 1fr))`,
          gridTemplateColumns: `repeat(${gridColumns}, minmax(32px, 1fr))`,
        }}
      >
        {gridArray.map((item, index) => {
          const x = index % gridColumns;
          const y = Math.floor(index / gridColumns);
          const id = item?.data?.id || undefined;

          const { transform, isCorner } = item?.type === 'gateway' ? getPositionTransform({x, y, columns: gridColumns, rows: gridRows, direction: item?.data?.direction || 'horizontal'}) : { transform: null, isCorner: null };

          const cctv = cctvData.find(
            (cctv) => (parseInt(cctv?.x) - 1) === x && (parseInt(cctv?.y) - 1) === y
          );
          const currBlock = cctv && showCctv ? {...cctv, id: `cctv-${cctv.id}`} : item?.data;
          const isActive = activeBlock?.id === currBlock?.id;

          return (
            <div
              key={index}
              className={`relative flex justify-center items-center size-full border-2 ${
                isActive
                  ? "border-blue-600/90"
                  : editMode ? " border-white-smoke " : " border-[#EDEEF0] "
              } hover:border-blue-400`}
              data-row={y}
              data-column={x}
              onDragOver={item.type === "empty" ? onDragOver : undefined}
              onDrop={
                item.type === "empty" ? (e) => onDrop(e, x, y) : undefined
              }
              onClick={() => {
                if (item.type !== "empty") {
                  onBlockClick({
                    ...currBlock,
                    isCorner: item.type === "gateway" ? isCorner : undefined,
                  });
                }
              }}
                        >
              {item.type === "slot" ? (
                <div
                  id={id}
                  draggable
                  onDragStart={onDragStart}
                  className="p-1 cursor-pointer"
                >
                  <SlotBox size={64} className="cursor-pointer" isActive={ isActive && currBlock.id?.includes('slot') } status={item.data.status} />
                </div>
              ) : item.type === "gateway" ? (
                <div className="relative w-full h-full">
                  <div
                    id={id}
                    className="absolute inset-0 z-10 flex justify-center items-center cursor-pointer"
                    draggable
                    onDragStart={onDragStart}
                    style={{
                      transform: transform,
                    }}
                  >
                    <Gateway text={item.data.text} borderPosition="y" bg={editMode} />
                  </div>
                  {editMode && (
                    <button
                      className="absolute top-0 right-0 z-20 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBlockClick({ ...item.data, id: `gateway-${item.data.id}`, action: 'delete' });
                      }}
                      title="Hapus Gateway"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : editMode ? (
                <div className="flex w-fit h-fit p-1 aspect-square">
                  <div className="bg-pink-300 flex w-full h-full min-h-16 text-black justify-center items-center rounded-md aspect-square">
                    <span>Kosong</span>
                  </div>
                </div>
              ) : (
                <div className="none"></div>
              )}

              {cctv && showCctv && (
                <div className="absolute w-full h-full z-20 overflow-visible">
                  <div
                    id={currBlock.id}
                    draggable
                    onDragStart={onDragStart}
                    className="absolute w-full h-full flex justify-center items-center cursor-pointer overflow-visible"
                    onClick={() => {
                      console.log(cctv.id)
                      onBlockClick({
                        ...currBlock,
                      });
                    }}    
                  >
                    <CctvSpotEdit isActive={activeBlock?.id === currBlock.id} angle={cctv.angle} offsetX={cctv.offset_x} offsetY={cctv.offset_y} animate={true} />
                  </div>
                  {editMode && (
                    <button
                      className="absolute top-0 right-0 z-30 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBlockClick({ ...cctv, id: `cctv-${cctv.id}`, action: 'delete' });
                      }}
                      title="Hapus CCTV"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
