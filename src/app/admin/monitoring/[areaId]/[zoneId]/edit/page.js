'use client';

import Sidebar from "@/app/_components/Sidebar";
import SlotArea from "../../../../../_components/SlotArea";
import EditSidebar from "./EditSidebar";
import { useEffect, useState } from "react";
import { API_CONFIG } from '../../../../../lib/config/apiConfig.js';
import dummySlot from "./dummySlot";
// Client-side fetch function
const clientFetch = async (endpoint, options = {}) => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  // Get token from API route
  const tokenResponse = await fetch('/api/admin/token');
  if (!tokenResponse.ok) {
    throw new Error('Failed to get authentication token');
  }
  
  const { token } = await tokenResponse.json();
  console.log('Token from API route:', token ? 'Token found' : 'No token');
  console.log('Fetching:', `${baseUrl}${endpoint}`);
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HTTP ${response.status}: ${errorText}`);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    const text = await response.text();
    console.error('Non-JSON response:', text);
    throw new Error('Server returned non-JSON response');
  }
};

// Wrapper function to match the existing fetchApi interface
const fetchApi = async ({ method = 'GET', endpoint, data }) => {
  const options = {
    method: method.toUpperCase(),
    ...(data && { body: JSON.stringify(data) })
  };
  
  return await clientFetch(endpoint, options);
};
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
  const [isSaving, setIsSaving] = useState(false)

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
      endpoint: `/admin/part/${zoneId}/get-parts-data`,
    }).then((resp) => {
      if (resp.length>0) {
        setPartData(resp);
        setActivePart(resp[0]);
      }
    }).catch(e => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activePart && activePart.id > 0) {
      fetchApi({
        method: "get",
        endpoint: `/admin/slot-parkir/${activePart.id}/${zoneId}/get-slot-on-part`,
        contentType: "application/json",
      }).then((resp) => {
        if(resp.slots) {
          setParkingSlot(resp.slots);
        } else {
          setParkingSlot([]);
        }
      });

      fetchApi({
        method: "get",
        endpoint: `/admin/cctv/${activePart.id}/${zoneId}/${areaId}/get-cctv-on-part`,
        contentType: "application/json",
      }).then((resp) => {
        if(resp.cctvs?.length > 0) {
          setCctv(resp.cctvs);
        } else {
          setCctv([]);
        }
      });

      fetchApi({
        method: "get",
        endpoint: `/admin/gateway/${activePart.id}/${zoneId}/get-gateway-on-part`,
        contentType: "application/json",
      }).then((resp) => {
        if(resp.gateways?.length > 0) {
          setGateway(resp.gateways);
        } else {
          setGateway([]);
        }
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
      [name]: value
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
              isUpdated: !part?.isNew,
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
          direction: 'x',
          gateway_name: `Gateway ${gateway.length + 1}`,
          isNew: true,
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
        const newSlot = {
          id: Date.now(),
          x: col,
          y: row,
          status: 'Kosong',
          slot_name: Date.now(),
          isNew: true
        };
        return [...prevSlots, newSlot];
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

  const handleBlockClick = (block) => {
    // console.log(block)
    if (toogleData.deleteMode) {
      handleDeleteMode(block);
    } else {
      const { id } = block;
      
      // Handle delete action from delete button
      if (block.action === 'delete') {
        const itemType = id.includes('gateway') ? 'Gateway' : 'CCTV';
        const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus ${itemType} ini?`);
        
        if (confirmDelete) {
          const types = id.includes('gateway') ? 'gateway' : 'cctv';
          const splitIdNumber = id => parseInt(id.split('-')[1]);
          if(types === 'gateway') {
            setGateway(gateway.filter(item => item.id !== splitIdNumber(id)));
          }
          if(types === 'cctv') {
            setCctv(cctv.filter(item => item.id !== splitIdNumber(id)));
          }
          setDeletedBlock(prev => [...prev, id]);
        }
        return;
      }
      
      // Check if id is string before splitting
      if (typeof id === 'string' && id.includes('-')) {
        const [type] = id.split('-');
        
        if (type === 'slot') {
          // Show options for slot: change status or delete
          const slotId = parseInt(id.split('-')[1]);
          const slot = parkingSlot.find(s => s.id === slotId);
          
          if (slot) {
            const action = confirm(
              `Pilih aksi untuk slot ${slot.slot_name}:\n\n` +
              `OK = Ubah status (${slot.status === 'Terisi' ? 'Kosong' : 'Terisi'})\n` +
              `Cancel = Hapus slot (area menjadi kosong untuk CCTV/Gateway)`
            );
            
            if (action) {
              // Change status
              handleSlotStatusChange(slotId);
            } else {
              // Delete slot
              handleDeleteSlot(slotId);
            }
          }
          return;
        }
      }
      
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

      const numericId = parseInt(id.split('-')[1]);

      if (id?.includes("gateway")) {
        setGateway((prevGateways) =>
          prevGateways.map((item) =>
            item.id === numericId ? { ...item, ...props, isUpdated: !item.isNew } : item
          )
        );
      } else if (id?.includes("cctv")) {
        setCctv((prevCctvs) =>
          prevCctvs.map((item) =>
            item.id === numericId ? { ...item, ...props, isUpdated: !item.isNew } : item
          )
        );
      } else if (id?.includes("slot")) {
        setParkingSlot((prevSlots) =>
          prevSlots.map((item) =>
            item.id === numericId ? { ...item, ...props, isUpdated: !item.isNew } : item
          )
        );
      }
    };

    const handleChangePart = e => {
      const { value } = e.target;
      setActivePart(partData.find( part => part.id === parseInt(value)));
    }
    
    // function handlePartChange(id, changes) {
    //   setPartData((prevParts) =>
    //     prevParts.map((part) =>
    //       part.id === id ? { ...part, ...changes } : part
    //     )
    //   );
    // }

    // Function to refresh data after successful save
    const refreshData = async () => {
      try {
        // Refresh part data
        const partResponse = await fetchApi({
          method: "get",
          endpoint: `/admin/part/${zoneId}/get-parts-data`,
        });
        let currentPart = activePart;
        if (partResponse.length > 0) {
          setPartData(partResponse);
          currentPart = partResponse.find(part => part.id === activePart.id) || partResponse[0];
          setActivePart(currentPart);
        }
        


        // Refresh slot data using currentPart
        if (currentPart && currentPart.id > 0) {
          const slotResponse = await fetchApi({
            method: "get",
            endpoint: `/admin/slot-parkir/${currentPart.id}/${zoneId}/get-slot-on-part`,
            contentType: "application/json",
          });
          if (slotResponse.slots) {
            setParkingSlot(slotResponse.slots);
          } else {
            setParkingSlot([]);
          }

          // Refresh CCTV data
          const cctvResponse = await fetchApi({
            method: "get",
            endpoint: `/admin/cctv/${currentPart.id}/${zoneId}/${areaId}/get-cctv-on-part`,
            contentType: "application/json",
          });
          if (cctvResponse.cctvs?.length > 0) {
            setCctv(cctvResponse.cctvs);
          } else {
            setCctv([]);
          }

          // Refresh Gateway data
          console.log('=== REFRESHING GATEWAY DATA ===');
          console.log('Gateway refresh endpoint:', `/admin/gateway/${currentPart.id}/${zoneId}/get-gateway-on-part`);
          
          const gatewayResponse = await fetchApi({
            method: "get",
            endpoint: `/admin/gateway/${currentPart.id}/${zoneId}/get-gateway-on-part`,
            contentType: "application/json",
          });
          
          console.log('Gateway refresh response:', JSON.stringify(gatewayResponse, null, 2));
          
          if (gatewayResponse.gateways?.length > 0) {
            console.log('Setting gateway data:', gatewayResponse.gateways.length, 'gateways found');
            setGateway(gatewayResponse.gateways);
          } else {
            console.log('No gateways found, setting empty array');
            setGateway([]);
          }
        }

        // Clear deleted items and reset flags
        setDeletedBlock([]);
        
        // Reset isNew and isUpdated flags for all data
        setParkingSlot(prev => prev.map(slot => ({ ...slot, isNew: false, isUpdated: false })));
        setGateway(prev => prev.map(gw => ({ ...gw, isNew: false, isUpdated: false })));
        setCctv(prev => prev.map(c => ({ ...c, isNew: false, isUpdated: false })));
        setPartData(prev => prev.map(part => ({ ...part, isNew: false, isUpdated: false })));
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    };

    const handleSlotStatusChange = async (slotId) => {
    try {
      const slot = parkingSlot.find(s => s.id === slotId);
      if (!slot) return;

      const endpoint = slot.status === 'Terisi' 
        ? '/admin/slot-parkir/ubah-slot-ke-kosong'
        : '/admin/slot-parkir/ubah-slot-ke-terisi';
      
      const response = await fetchApi({
        method: "POST",
        endpoint: endpoint,
        data: {
          id_blok: activePart.id,
          slot_name: slot.slot_name
        }
      });

      if (response.status === 'success') {
        // Update local state
        setParkingSlot(prev => prev.map(s => 
          s.id === slotId 
            ? { ...s, status: slot.status === 'Terisi' ? 'Kosong' : 'Terisi' }
            : s
        ));
        toast.success(response.pesan);
      } else {
        toast.error(response.pesan || 'Gagal mengubah status slot');
      }
    } catch (error) {
      console.error('Error changing slot status:', error);
      toast.error('Terjadi kesalahan saat mengubah status slot');
    }
  };

  const handleDeleteSlot = (slotId) => {
    const slot = parkingSlot.find(s => s.id === slotId);
    if (!slot) return;
    
    const confirmDelete = confirm(
      `Yakin ingin menghapus slot ${slot.slot_name}?\n\n` +
      `Area ini akan menjadi kosong dan dapat diisi dengan CCTV atau Gateway.`
    );
    
    if (confirmDelete) {
      // Remove from local state
      setParkingSlot(prev => prev.filter(s => s.id !== slotId));
      
      // Add to deleted list if not a new slot
      if (!slot.isNew) {
        setDeletedBlock(prev => [...prev, `slot-${slotId}`]);
      }
      
      toast.success(`Slot ${slot.slot_name} berhasil dihapus`);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    console.log('=== STARTING SAVE OPERATION ===');
    console.log('Current state:', {
      activePart,
      parkingSlot: parkingSlot.length,
      gateway: gateway.length,
      cctv: cctv.length,
      partData: partData.length
    });
    
    const maxRetries = 3;
    
    const executeWithRetry = async (operation, operationName) => {
      let retryCount = 0;
      while (retryCount < maxRetries) {
        try {
          console.log(`Executing ${operationName}...`);
          const result = await operation();
          console.log(`${operationName} completed successfully:`, result);
          return result;
        } catch (error) {
          retryCount++;
          console.error(`${operationName} attempt ${retryCount} failed:`, error);
          if (retryCount >= maxRetries) {
            throw error;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    };

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
          updated: partData.filter((part) => part.isUpdated),
        },
      };
      
      console.log('=== PAYLOAD DATA ===');
      console.log('Payload to be sent:', JSON.stringify(payload, null, 2));
      console.log('Slots new count:', payload.slots.new.length);
      console.log('Slots updated count:', payload.slots.updated.length);
      console.log('Slots deleted count:', payload.slots.deleted.length);
      console.log('Gateways new count:', payload.gateways.new.length);
      console.log('Gateways updated count:', payload.gateways.updated.length);
      console.log('Gateways deleted count:', payload.gateways.deleted.length);
      console.log('CCTVs new count:', payload.cctvs.new.length);
      console.log('CCTVs updated count:', payload.cctvs.updated.length);
      console.log('CCTVs deleted count:', payload.cctvs.deleted.length);
      console.log('Parts updated count:', payload.parts.updated.length);
        console.log('==================');
    
        // Handle CREATE (POST) with retry
        if (payload.slots.new.length > 0) {
          await executeWithRetry(async () => {
            console.log('=== SLOT CREATE REQUEST ===');
            console.log('Endpoint:', `/admin/slot-parkir/${activePart.id}/${zoneId}/create-all-slot`);
            console.log('Slot data to send:', JSON.stringify(payload.slots.new, null, 2));
            
            // Transform slot data to match backend expectations
            const slotsData = payload.slots.new.map((slot, index) => ({
              slot_name: Date.now() + index, // Generate unique slot name as integer
              x: String(slot.x),
              y: String(slot.y),
              status: slot.status || 'Kosong'
            }));
            
            console.log('Transformed slot data:', JSON.stringify(slotsData, null, 2));
            
            const response = await fetchApi({
              method: "POST",
              endpoint: `/admin/slot-parkir/${activePart.id}/${zoneId}/create-all-slot`,
              data: { slots: slotsData },
            });
            
            console.log('=== SLOT CREATE RESPONSE ===');
            console.log('Full response:', JSON.stringify(response, null, 2));
            
            if (response.status !== 'success') {
              throw new Error(response.pesan || 'Gagal membuat slot parkir');
            }
            return response;
          }, 'Create slots');
        }
    
        if (payload.gateways.new.length > 0) {
          await executeWithRetry(async () => {
            console.log('=== GATEWAY CREATE REQUEST ===');
            console.log('Endpoint:', `/admin/gateway/${activePart.id}/${zoneId}/create-all-gateway`);
            console.log('Gateway data to send:', JSON.stringify(payload.gateways.new, null, 2));
            
            // Transform gateway data to match backend expectations
            const gatewayData = payload.gateways.new.map(gw => ({
              gateway_name: gw.gateway_name || `Gateway ${gw.id}`,
              x: String(gw.x),
              y: String(gw.y),
              direction: gw.direction || gw.position || 'x',
              position: gw.position || gw.direction || 'x'
            }));
            
            console.log('Transformed gateway data:', JSON.stringify(gatewayData, null, 2));
            
            const response = await fetchApi({
              method: "POST",
              endpoint: `/admin/gateway/${activePart.id}/${zoneId}/create-all-gateway`,
              data: { gateways: gatewayData },
            });
            
            console.log('=== GATEWAY CREATE RESPONSE ===');
            console.log('Full response:', JSON.stringify(response, null, 2));
            
            if (response.status !== 'success') {
              throw new Error(response.pesan || 'Gagal membuat gateway');
            }
            return response;
          }, 'Create gateways');
        }

        if (payload.cctvs.new.length > 0) {
          await executeWithRetry(async () => {
            console.log('=== CCTV CREATE REQUEST ===');
            console.log('Endpoint:', `/admin/cctv/${activePart.id}/${zoneId}/${areaId}/create-all-cctv`);
            console.log('CCTV data to send:', JSON.stringify(payload.cctvs.new, null, 2));
            
            // Transform CCTV data to match backend expectations
            const cctvData = payload.cctvs.new.map(cctv => ({
              jenis_kamera: cctv.jenis_kamera || 'Default Camera',
              x: String(cctv.x),
              y: String(cctv.y),
              angle: String(cctv.angle || '0'),
              url: cctv.url || '',
              offset_x: String(cctv.offset_x || '0'),
              offset_y: String(cctv.offset_y || '0')
            }));
            
            console.log('Transformed CCTV data:', JSON.stringify(cctvData, null, 2));
            
            const response = await fetchApi({
              method: "POST",
              endpoint: `/admin/cctv/${activePart.id}/${zoneId}/${areaId}/create-all-cctv`,
              data: { cctvs: cctvData },
            });
            
            console.log('=== CCTV CREATE RESPONSE ===');
            console.log('Full response:', JSON.stringify(response, null, 2));
            
            if (response.status !== 'success') {
              throw new Error(response.pesan || 'Gagal membuat CCTV');
            }
            return response;
          }, 'Create CCTV');
        }
    
        // Handle UPDATE (PUT) with retry
        if (payload.parts.updated.length > 0) {
          for (const part of payload.parts.updated) {
            await executeWithRetry(async () => {
              const response = await fetchApi({
                method: "PUT",
                endpoint: `/admin/part/${zoneId}/update-parts-data`,
                data: {
                  id: part.id,
                  nama: part.nama,
                  column: part.column,
                  row: part.row,
                },
              });
              if (response.status !== 'success') {
                throw new Error(response.pesan || 'Gagal mengupdate part');
              }
              return response;
            }, `Update part ${part.id}`);
          }
        }
        
        if (payload.slots.updated.length > 0) {
          await executeWithRetry(async () => {
            const slotsData = payload.slots.updated.map(slot => ({
              id: slot.id,
              slot_name: slot.slot_name,
              x: String(slot.x),
              y: String(slot.y),
              status: slot.status || 'Kosong'
            }));
            
            const response = await fetchApi({
              method: "PUT",
              endpoint: `/admin/slot-parkir/${activePart.id}/${zoneId}/update-all-slot`,
              data: { slots: slotsData },
            });
            if (response.status !== 'success') {
              throw new Error(response.pesan || 'Gagal mengupdate slot parkir');
            }
            return response;
          }, 'Update slots');
        }
    
        if (payload.gateways.updated.length > 0) {
          await executeWithRetry(async () => {
            const response = await fetchApi({
              method: "PUT",
              endpoint: `/admin/gateway/${activePart.id}/${zoneId}/update-all-gateway`,
              data: { gateways: payload.gateways.updated },
            });
            if (response.status !== 'success') {
              throw new Error(response.pesan || 'Gagal mengupdate gateway');
            }
            return response;
          }, 'Update gateways');
        }

        if (payload.cctvs.updated.length > 0) {
          await executeWithRetry(async () => {
            console.log('=== CCTV UPDATE REQUEST ===');
            console.log('Endpoint:', `/admin/cctv/${activePart.id}/${zoneId}/${areaId}/update-all-cctv`);
            console.log('CCTV data to send:', JSON.stringify(payload.cctvs.updated, null, 2));
            
            // Transform CCTV data to match backend expectations
            const cctvData = payload.cctvs.updated.map(cctv => ({
              id: cctv.id,
              jenis_kamera: cctv.jenis_kamera || 'Default Camera',
              x: String(cctv.x),
              y: String(cctv.y),
              angle: String(cctv.angle || '0'),
              url: cctv.url || '',
              offset_x: String(cctv.offset_x || '0'),
              offset_y: String(cctv.offset_y || '0')
            }));
            
            console.log('Transformed CCTV data:', JSON.stringify(cctvData, null, 2));
            
            const response = await fetchApi({
              method: "PUT",
              endpoint: `/admin/cctv/${activePart.id}/${zoneId}/${areaId}/update-all-cctv`,
              data: { cctvs: cctvData },
            });
            
            console.log('=== CCTV UPDATE RESPONSE ===');
            console.log('Full response:', JSON.stringify(response, null, 2));
            
            if (response.status !== 'success') {
              throw new Error(response.pesan || 'Gagal mengupdate CCTV');
            }
            return response;
          }, 'Update CCTV');
        }
    
        // Handle DELETE with retry
        if (payload.slots.deleted.length > 0) {
          await executeWithRetry(async () => {
            const response = await fetchApi({
              method: "DELETE",
              endpoint: `/admin/slot-parkir/${activePart.id}/${zoneId}/delete-many-slot`,
              data: { ids: payload.slots.deleted.map((id) => parseInt(id.split("-")[1])) },
            });
            if (response.status !== 'success') {
              throw new Error(response.pesan || 'Gagal menghapus slot parkir');
            }
            return response;
          }, 'Delete slots');
        }

        if (payload.gateways.deleted.length > 0) {
          await executeWithRetry(async () => {
            const response = await fetchApi({
              method: "DELETE",
              endpoint: `/admin/gateway/${activePart.id}/${zoneId}/delete-many-gateway`,
              data: { ids: payload.gateways.deleted.map((id) => parseInt(id.split("-")[1])) },
            });
            if (response.status !== 'success') {
              throw new Error(response.pesan || 'Gagal menghapus gateway');
            }
            return response;
          }, 'Delete gateways');
        }

        if (payload.cctvs.deleted.length > 0) {
          await executeWithRetry(async () => {
            const response = await fetchApi({
              method: "DELETE",
              endpoint: `/admin/cctv/${activePart.id}/${zoneId}/${areaId}/delete-many-cctv`,
              data: { ids: payload.cctvs.deleted.map((id) => parseInt(id.split("-")[1])) },
            });
            if (response.status !== 'success') {
              throw new Error(response.pesan || 'Gagal menghapus CCTV');
            }
            return response;
          }, 'Delete CCTV');
        }
    
        toast.success("Data berhasil disimpan!");
         
         // Wait longer before refreshing to ensure data is committed to database
         setTimeout(async () => {
           try {
             await refreshData();
             
             // Multiple verification attempts with better error handling
             let verificationSuccess = false;
             let lastError = null;
             
             for (let i = 0; i < 3; i++) {
               try {
                 await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                 const verifyResponse = await fetchApi({
                   method: "get",
                   endpoint: `/admin/slot-parkir/${activePart.id}/${zoneId}/get-slot-on-part`,
                   contentType: "application/json",
                 });
                 
                 if (verifyResponse && (verifyResponse.slots || verifyResponse.status === 'success')) {
                   verificationSuccess = true;
                   console.log('Data verification successful');
                   break;
                 }
               } catch (verifyError) {
                 lastError = verifyError;
                 console.warn(`Verification attempt ${i + 1} failed:`, verifyError);
               }
             }
             
             if (!verificationSuccess) {
               console.error('All verification attempts failed. Last error:', lastError);
               toast.warning('Data telah disimpan, namun verifikasi gagal. Silakan refresh halaman untuk memastikan perubahan tersimpan.');
             } else {
               toast.success('Data berhasil disimpan dan diverifikasi!');
             }
           } catch (refreshError) {
             console.error('Error during refresh:', refreshError);
             toast.error('Gagal memuat ulang data. Silakan refresh halaman secara manual.');
           }
         }, 2000);
        
      } catch (error) {
        console.error('=== SAVE OPERATION ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // More specific error messages
        let errorMessage = "Terjadi kesalahan saat menyimpan data.";
        if (error.message.includes('fetch failed')) {
          errorMessage = "Koneksi ke server gagal. Pastikan server backend berjalan.";
        } else if (error.message.includes('gateway')) {
          errorMessage = "Gagal menyimpan data gateway. Silakan coba lagi.";
        } else if (error.message.includes('slot')) {
          errorMessage = "Gagal menyimpan data slot parkir. Silakan coba lagi.";
        } else if (error.message.includes('cctv')) {
          errorMessage = "Gagal menyimpan data CCTV. Silakan coba lagi.";
        }
        
        toast.error(errorMessage);
      } finally {
        setIsSaving(false);
      }
    };
    
    
  return (
    <main className="bg-[#EDEEF0] min-h-screen w-full flex flex-col">
      <div className="flex w-full flex-1 justify-start bg-[#EDEEF0] mt-[72px]">
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
          isSaving={isSaving}
          />
        <div className="flex relative bg-white-smoke justify-start items-center overflow-hidden w-[100%] h-[calc(100vh-72px)]">
          <div className="flex flex-col items-center w-full p-4">
            {/* Tip positioned above the zone box */}
            <div className="bg-blue-100 p-3 rounded-lg text-sm text-blue-800 mb-4 max-w-md">
              <div className="font-semibold mb-1">💡 Tip: Klik slot parkir untuk pilihan:</div>
              <div className="space-y-1">
                <div>• <strong>OK</strong> = Ubah status (Kosong ↔ Terisi)</div>
                <div>• <strong>Cancel</strong> = Hapus slot (area kosong untuk CCTV/Gateway)</div>
              </div>
            </div>
            
            {/* Zone parking area */}
            <div className="relative">
              <SlotArea
                gridRows={activePart?.row || 2}
                gridColumns={activePart?.column || 2}
                gatewayData={gateway}
                cctvData={cctv}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                slotData={parkingSlot}
                onDragStart={handleDragStart}
                onBlockClick={handleBlockClick}
                activeBlock={activeBlock}
                toogleData={toogleData}
                editMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
