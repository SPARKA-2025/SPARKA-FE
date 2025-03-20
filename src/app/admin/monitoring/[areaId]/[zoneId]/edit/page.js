'use client';

import Sidebar from "@/app/_components/Sidebar";
import SlotArea from "../../../../../_components/SlotArea";
import EditSidebar from "./EditSidebar";
import { useEffect, useState } from "react";
import dummySlot from "./dummySlot";
import fetchApi from "@/app/lib/fetch/fetchApi";
import { toast } from "react-toastify";
// import cctvDummy from "@/app/lib/utils/dummy/cctvData";
// import slotDummy from "@/app/lib/utils/dummy/slotData";

export default function Main({params}) {
  const {zoneId, areaId} = params

  const [partData, setPartData] = useState([])
  const [activePart, setActivePart] = useState({
    id: 0,
    nama: 'not-fetched',
    row: 2,
    column: 2
  })

  const [parkingSlot, setParkingSlot] = useState([
    {
      id: 3856,
      x: 2,
      y: 3
    }
  ])
  const [gateway, setGateway] = useState([])
  const [cctv, setCctv] = useState([])
  const [activeBlock, setActiveBlock] = useState()
  const [deletedBlock, setDeletedBlock] = useState([])

  const [isDragGateway, setIsDragGateway] =useState(false)
  const [isDragCctv, setIsDragCctv] =useState(false)

  useEffect(() => console.log(cctv), [cctv])

  useEffect( () => {
    // fetchApi({
    //   method: 'get',
    //   endpoint: `/admin/slot-parkir/${zoneId}/get-total-data-slot`
    // }).then( resp => {
    //   if(resp?.data) setParkingSlot(resp?.data)
    // })

    fetchApi({
      method: "get",
      endpoint: `/part/${zoneId}/get-parts-data`,
    }).then((resp) => {
      if (resp.length>0) {
        setPartData(resp);
        setActivePart(resp[0]);
      }
    }).catch(e => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activePart) {
      fetchApi({
        method: "get",
        endpoint: `/slot-parkir/${activePart.id}/${zoneId}/get-slot-on-part`,
        contentType: "application/json",
      }).then((resp) => {
        if(resp.slots) setParkingSlot(resp.slots);
      });

      fetchApi({
        method: "get",
        endpoint: `/cctv/${activePart.id}/${zoneId}/${areaId}/get-cctv-on-part`,
        contentType: "application/json",
      }).then((resp) => {
        if(resp.cctvs?.length > 0) setCctv(resp.cctvs);
      });

      fetchApi({
        method: "get",
        endpoint: `/gateway/${activePart.id}/${zoneId}/get-gateway-on-part`,
        contentType: "application/json",
      }).then((resp) => {
        if(resp.cctvs?.length > 0) setGateway(resp.cctvs);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePart]);

  // useEffect(() => console.log(activeBlock), [activeBlock])

  const [toogleData, setToogleData] = useState({
    showCctv: true,
    deleteMode: false,
  });

  const handleToogleClick = (name, value) => {
    setToogleData((prevData) => ({
      ...prevData,
      [name]: !value
    }));
  };

  const handleInputSizeChange = (e) => {
    const { id, value } = e.target;
  
    setActivePart((prev) => ({
      ...prev,
      [id]: value === "" ? "" : Math.max(1, parseInt(value) || 1),
      isUpdated: !prev?.isNew
    }));
  };
  
  const handleInputSizeBlur = (e) => {
    const { id, value } = e.target;
    console.log(activePart)
  
    setPartData((prevParts) =>
      prevParts.map((part) =>
        part.id === activePart.id
          ? {
              ...part,
              [id]: Math.max(1, parseInt(value) || 1),
              isUpdated: !prev?.isNew,
            }
          : part
      )
    );
  };
  
  const handleDragOver = (e) => {
    if (isDragGateway) {
      const dropZone = e.currentTarget;
      const x = parseInt(dropZone.dataset.column);
      const y = parseInt(dropZone.dataset.row);
  
      if (x === 0 || x === activePart.column - 1 || y === 0 || y === activePart.row - 1) {
        e.preventDefault();      }
    }else if(isDragCctv){
      const dropZone = e.currentTarget;
      const x = parseInt(dropZone.dataset.column);
      const y = parseInt(dropZone.dataset.row);

      const occupiedCctv = cctv.find( item => parseInt(item.x) - 1 === x && parseInt(item.y) - 1 === y)
      if(!occupiedCctv) e.preventDefault()
    }else{
      e.preventDefault();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
  
    const { id } = JSON.parse(e.dataTransfer.getData("text/plain"));
    const [types, blockId] = id.split('-');
    const { row, column: col } = e.currentTarget.dataset;
    const x = parseInt(col) + 1
    const y = parseInt(row) + 1
  
    console.log(`${types}-${blockId}: (${col}, ${row})`);
  
    if (types === 'gateway') {
      handleGatewayDrop(blockId, x, y);
    } else if (types === 'cctv') {
      console.log(blockId)
      handleCctvDrop(blockId, x, y);
    } else {
      handleParkingSlotDrop(blockId, x, y);
    }
  };
  
  const handleGatewayDrop = (id, col, row) => {
    setIsDragGateway(false);
    setGateway((prevGateways) => {
      if (id === 'new') {
        const newGateway = {
          id: Date.now(),
          x: col,
          y: row,
          position: 'x',
        };
        return [...prevGateways, newGateway];
      }

      return prevGateways.map((item) =>
        item?.id === parseInt(id)
          ? { ...item, x: col, y: row, isUpdated: !item?.isNew }
          : item
      );
    });
  };
  
  const handleCctvDrop = (id, col, row) => {
    setIsDragCctv(false)
    setCctv((prevCctvs) => {
      if (id === 'new') {
        const newCctv = {
          id: Date.now(),
          x: col,
          y: row,
          isNew: true,
        };
        return [...prevCctvs, newCctv];
      }
  
      return prevCctvs.map((item) =>
        item?.id === parseInt(id)
          ? { ...item, x: col, y: row, isUpdated: !item?.isNew }
          : item
      );
    });
  };
  
  const handleParkingSlotDrop = (id, col, row) => {
    console.log('drop slot on' + col + ',' + row)
    setParkingSlot((prevSlots) => {
      if (id === 'new') {
        console.log('baru')
        return [...prevSlots, { id: Date.now(), x: col, y: row, isNew: true }];
      }
  
      console.log(col+','+row)
      return prevSlots.map((item) =>
        item?.id === parseInt(id)
          ? { ...item, x: col, y: row, isUpdated: !item?.isNew }
          : item
      );
    });
  };

  const handleDragStart = (e) => {
    const { id } = e.target
    const data = { id };
    if(id?.includes('gateway')) setIsDragGateway(true)
    if(id?.includes('cctv')) setIsDragCctv(true)

    e.dataTransfer.setData("text/plain", JSON.stringify(data));
  };

  const handleBlockCLick = (block) => {
    // console.log(block)
    if (toogleData.deleteMode) {
      handleDeleteMode(block);
    } else {
      setActiveBlock(block);
    }
  };

  const handleDeleteMode = (block) => {
    const { id } =  block
    const types = id?.split('-')[0]
    // console.log(parkingSlot.filter( item => item.id === id.split('-')[1]))
    const splitIdNumber = id => parseInt(id.split('-')[1])

    if(types === 'slot') setParkingSlot(parkingSlot.filter( item => item.id !== splitIdNumber(id)))
    if(types === 'gateway') setGateway(gateway.filter( item => item.id !== splitIdNumber(id)))
    if(types === 'cctv') setCctv(cctv.filter( item => item.id !== splitIdNumber(id)))
  
    if(block.isNew) return
    setDeletedBlock( prev => {
      console.log([
        ...prev,
        id
      ])
      return[
        ...prev,
        id
      ]
    })
    }

    const handleChangeBlockProp = (id, props) => {
      setActiveBlock((prevActiveBlock) => ({
        ...prevActiveBlock,
        ...props,
      }));

      if (id?.includes("gateway")) {
        setGateway((prevGateways) =>
          prevGateways.map((item) =>
            item.id === id ? { ...item, ...props } : item
          )
        );
      } else if (id?.includes("cctv")) {
        setCctv((prevCctvs) =>
          prevCctvs.map((item) =>
            item.id === id ? { ...item, ...props } : item
          )
        );
      }
    };

    const handleChangePart = e => {
      const { value } = e.target;
      console.log(value)
      setActivePart(partData.find( part => part.id === parseInt(value)));
    }
    
    // function handlePartChange(id, changes) {
    //   setPartData((prevParts) =>
    //     prevParts.map((part) =>
    //       part.id === id ? { ...part, ...changes } : part
    //     )
    //   );
    // }

    const handleSubmit = async () => {
      try {
        const payload = {
          slots: {
            new: parkingSlot.filter((slot) => slot.isNew),
            updated: parkingSlot.filter((slot) => slot.isUpdated),
            deleted: deletedBlock.filter((id) => id.includes("slot")),
          },
          gateways: {
            new: gateway.filter((gw) => gw.isNew),
            updated: gateway.filter((gw) => gw.isUpdated),
            deleted: deletedBlock.filter((id) => id.includes("gateway")),
          },
          cctvs: {
            new: cctv.filter((c) => c.isNew),
            updated: cctv.filter((c) => c.isUpdated),
            deleted: deletedBlock.filter((id) => id.includes("cctv")),
          },
          parts: {
            // new: partData.filter((part) => part.isNew),
            updated: partData.filter((part) => part.isUpdated),
            // deleted: deletedBlock.filter((id) => id.includes("part")),
          },
        };
    
        // Handle CREATE (POST)
        // if (payload.parts.new.length > 0) {
        //   for (const part of payload.parts.new) {
        //     await fetchApi({
        //       method: "POST",
        //       endpoint: `/part/${zoneId}/create-parts-data`,
        //       body: JSON.stringify({ blokId: part.id_blok, nama: part.nama }),
        //     });
        //   }
        // }
    
        if (payload.slots.new.length > 0) {
          await fetchApi({
            method: "POST",
            endpoint: `/slot-parkir/${activePart.id}/${zoneId}/create-all-slot`,
            body: JSON.stringify({ slots: payload.slots.new }),
          }).catch((e) => {
            toast.error("error");
            return e;
          });
        }
    
        if (payload.gateways.new.length > 0) {
          await fetchApi({
            method: "POST",
            endpoint: `/gateway/${activePart.id}/${zoneId}/create-gateway`,
            body: JSON.stringify({ gateways: payload.gateways.new }),
          }).catch((e) => {
            toast.error("error");
            return e;
          });
        }
    
        if (payload.cctvs.new.length > 0) {
          await fetchApi({
            method: "POST",
            endpoint: `/cctv/${activePart.id}/${zoneId}/create-cctv`,
            body: JSON.stringify({ cctvs: payload.cctvs.new }),
          }).catch((e) => {
            toast.error("error");
            return e;
          });
        }
    
        // Handle UPDATE (PUT)
        if (payload.parts.updated.length > 0) {
          for (const part of payload.parts.updated) {
            await fetchApi({
              method: "PUT",
              endpoint: `/part/${zoneId}/update-parts-data`,
              body: JSON.stringify({
                id: part.id,
                nama: part.nama,
                column: part.column,
                row: part.row,
              }),
            }).catch((e) => {
              toast.error("error");
              return e;
            });;
          }
        }
        
        if (payload.slots.updated.length > 0) {
          await fetchApi({
            method: "PUT",
            endpoint: `/slot-parkir/${activePart.id}/${zoneId}/update-all-slot`,
            body: JSON.stringify({ slots: payload.slots.updated }),
          }).catch((e) => {
            toast.error("error");
            return e;
          });;
        }
    
        if (payload.gateways.updated.length > 0) {
          await fetchApi({
            method: "PUT",
            endpoint: `/gateway/${activePart.id}/${zoneId}/update-all-gateway`,
            body: JSON.stringify({ gateways: payload.gateways.updated }),
          }).catch((e) => {
            toast.error("error");
            return e;
          });;
        }
    
        if (payload.cctvs.updated.length > 0) {
          await fetchApi({
            method: "PUT",
            endpoint: `/cctv/${activePart.id}/${zoneId}/update-all-cctv`,
            body: JSON.stringify({ cctvs: payload.cctvs.updated }),
          }).catch((e) => {
            toast.error("error");
            return e;
          });;
        }
    
        // Handle DELETE
        // if (payload.parts.deleted.length > 0) {
        //   await fetchApi({
        //     method: "DELETE",
        //     endpoint: `/part/${zoneId}/delete-parts-data`,
        //     body: JSON.stringify({ id: payload.parts.deleted.map((id) => parseInt(id.split("-")[1])) }),
        //   });
        // }
    
        if (payload.slots.deleted.length > 0) {
          await fetchApi({
            method: "DELETE",
            endpoint: `/slot-parkir/${activePart.id}/${zoneId}/delete-many-slot`,
            body: JSON.stringify({ ids: payload.slots.deleted.map((id) => parseInt(id.split("-")[1])) }),
          }).catch((e) => {
            toast.error("error");
            return e;
          });;
        }
    
        if (payload.gateways.deleted.length > 0) {
          await fetchApi({
            method: "DELETE",
            endpoint: `/gateway/${activePart.id}/${zoneId}/delete-many-gateway`,
            body: JSON.stringify({ ids: payload.gateways.deleted.map((id) => parseInt(id.split("-")[1])) }),
          }).catch((e) => {
            toast.error("error");
            return e;
          });;
        }
    
        if (payload.cctvs.deleted.length > 0) {
          await fetchApi({
            method: "DELETE",
            endpoint: `/cctv/${activePart.id}/${zoneId}/delete-many-cctv`,
            body: JSON.stringify({ ids: payload.cctvs.deleted.map((id) => parseInt(id.split("-")[1])) }),
          }).catch((e) => {
            toast.error("error");
            return e;
          });;
        }
    
        toast.success("Data berhasil disimpan!");
      } catch (error) {
        toast.error("Gagal menyimpan data:", error);
        alert("Terjadi kesalahan saat menyimpan data.");
      }
    };
    
    
  return (
    <main className="bg-[#EDEEF0] h-screen w-full flex flex-col pt-[72px] fixed">
      <div className="flex w-full h-[90vh] justify-start bg-black">
        <EditSidebar
          stateValue={toogleData}
          onToogleClick={handleToogleClick}
          onDragStart={handleDragStart}
          onInputSizeChange={handleInputSizeChange}
          onInputSizeBlur={handleInputSizeBlur}
          activeBlock={activeBlock}
          onChangeBlockProp={handleChangeBlockProp}
          partData={partData}
          activePart={activePart}
          onChangePart={handleChangePart}
          onSubmit={handleSubmit}
          />
        <div className="flex pb-16 relative aspect-video bg-white-smoke justify-start items-center overflow-auto w-[100%] h-full self-end">
          <SlotArea
          gridRows={activePart?.row || 2}
          gridColumns={activePart?.column || 2}
          gatewayData={gateway}
          cctvData={cctv}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            slotData={parkingSlot}
            onDragStart={handleDragStart}
            onBlockClick={handleBlockCLick}
            activeBlock={activeBlock}
            toogleData={toogleData}
            editMode={true}
          />
        </div>
      </div>
      <Sidebar active={2} />
    </main>
  );
}
