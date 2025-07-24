"use client";

import { useState, useEffect } from "react";
import fetchApi from "@/app/lib/fetch/fetchApi";
import Sidebar from "@components/Sidebar";
import { useRouter } from "next/navigation";
import ModalForm from "@/app/_components/admin/ModalForm"; // ModalForm component
import { toast } from "react-toastify";
import { API_CONFIG } from '../../../lib/config/apiConfig.js';


// Client-side fetch function
const clientFetch = async (endpoint) => {
  const baseUrl = API_CONFIG.BASE_URL;
  
  // Get token from Next.js API route (which reads from cookie)
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
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export default function Main({ params }) {
  const { areaId } = params;
  const [blockList, setBlockList] = useState([]);
  const [slotData, setSlotData] = useState({}); // For storing slot data per block
  const [isModalOpen, setIsModalOpen] = useState(false); // For managing modal visibility
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formValues, setFormValues] = useState({
    id: null,
    nama: "",
    panjang: "",
    lebar: "",
    deskripsi: "",
  }); // For managing form values
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch block list
        const blockRes = await fetchApi({
          endpoint: `/admin/fakultas/${areaId}/blok`,
        });
        
        if (blockRes.data) {
          setBlockList(blockRes.data);
          
          // Fetch slot data for all blocks using client fetch
          const slotRes = await clientFetch(`/admin/slot-parkir/get-idblok-slotname-status`);
          console.log('Slot response:', slotRes);
          
          // Check if slotRes is an array directly or has data property
          const slotsArray = Array.isArray(slotRes) ? slotRes : (slotRes.data || []);
          console.log('Slots array:', slotsArray);
          
          if (slotsArray.length > 0) {
             // Process slot data for each block
             const slotDataByBlock = {};
             
             blockRes.data.forEach((block) => {
               // Filter slots for this specific block
               const blockSlots = slotsArray.filter(slot => slot.id_blok === block.id);
               console.log(`Block ${block.id} slots:`, blockSlots);
               
               // Count status for this block
               const statusCount = {
                 kosong: blockSlots.filter(slot => slot.status === 'Kosong').length,
                 terisi: blockSlots.filter(slot => slot.status === 'Terisi').length,
                 dibooking: blockSlots.filter(slot => slot.status === 'Dibooking').length,
                 total: blockSlots.length
               };
               
               console.log(`Block ${block.id} status count:`, statusCount);
               slotDataByBlock[block.id] = statusCount;
             });
             
             setSlotData(slotDataByBlock);
           } else {
             console.log('No slot data found');
           }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId]);

  // Open Modal
  const openModal = (block = null) => {
    if (block) {
      setFormValues({
        id: block.id,
        nama: block.nama,
        panjang: block.panjang,
        lebar: block.lebar,
        deskripsi: block.deskripsi,
      });
    } else {
      setFormValues({
        id: null,
        nama: "",
        panjang: "",
        lebar: "",
        deskripsi: "",
      });
    }
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle field change
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_fakultas", areaId);
    formData.append("nama", formValues.nama);
    formData.append("panjang", formValues.panjang);
    formData.append("lebar", formValues.lebar);
    formData.append("deskripsi", formValues.deskripsi);

    try {
      const endpoint = formValues.id
        ? `/admin/fakultas/${areaId}/blok/${formValues.id}`
        : `/admin/fakultas/${areaId}/blok`;
      const method = "post";

      const res = await fetchApi({
        method,
        endpoint,
        data: formData,
        contentType: "multipart/form-data",
      });

      if (res.status === "success") {
        toast.success(formValues.id ? "Zone updated successfully!" : "Zone added successfully!");
        router.back();
      } else {
        toast.error(`Failed to save zone. Please try again.\n${JSON.stringify(res)}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Zone Add/Edit Error:", error);
    }
  };

  // Delete Zone
  const handleDelete = async () => {
    try {
      const endpoint = `/admin/fakultas/${areaId}/blok/${formValues.id}`;
      const method = "delete";

      const res = await fetchApi({ endpoint, method });

      if (res.status === "success") {
        toast.success("Zone deleted successfully!");
        router.back();
      } else {
        toast.error(`Failed to delete zone. Please try again.\n${JSON.stringify(res)}`);
      }
    } catch (error) {
      console.error("Error deleting zone:", error);
    }
  };

  // Fields for the form
  const fields = [
    { name: "nama", label: "Nama", placeholder: "Nama Blok", type: "text", required: true },
    { name: "panjang", label: "Panjang", placeholder: "Panjang Blok", type: "number", required: true },
    { name: "lebar", label: "Lebar", placeholder: "Lebar Blok", type: "number", required: true },
    { name: "deskripsi", label: "Deskripsi", placeholder: "Deskripsi Blok", type: "text", required: true, multiline: true, rows: 4 },
  ];

  return (
    <main className="bg-white-smoke h-screen justify-start px-2 flex flex-wrap overflow-y-auto pt-[10%]">
      <div className="bg-white m-[4%] p-[4%] h-fit flex flex-wrap justify-start gap-x-4 w-[80%] mx-auto">


        {blockList.map((block, index) => {
          const blockSlotData = slotData[block.id] || { kosong: 0, terisi: 0, dibooking: 0, total: 0 };
          
          return (
            <div key={index} className="w-full h-fit flex flex-wrap justify-between mx-2">
              <div className="w-full p-8 rounded-xl shadow-lg text-primary flex flex-col justify-between mb-6 bg-white relative">
                {/* Overlay Status Zona Parkir - Pojok Kanan Atas */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/95 backdrop-blur-md rounded-lg p-2 shadow-sm border border-white/20">
                    <div className="flex justify-between items-center gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-green-700">{blockSlotData.kosong || 0}</div>
                        <div className="text-green-600 font-medium">Kosong</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-red-700">{blockSlotData.terisi || 0}</div>
                        <div className="text-red-600 font-medium">Terisi</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-700">{blockSlotData.dibooking || 0}</div>
                        <div className="text-yellow-600 font-medium">Booking</div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                
                <div>
                  <span className="font-bold text-2xl">{block.nama}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                    <span>{block.panjang}m × {block.lebar}m</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </div>
                </div>
                
                <span className="text-sm text-gray-600">{block.deskripsi}</span>
                <div className="mt-4 flex justify-end items-center gap-6 text-gray-700">
                  <button
                    onClick={() => openModal(block)}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => router.push(`/admin/monitoring/${areaId}/${block.id}`)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                  >
                    Buka
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        <div
          onClick={() => openModal()} // Add new block
          className="w-full h-fit flex flex-wrap cursor-pointer mx-2 p-8 rounded-xl shadow-lg text-primary flex-col mb-6 min-h-[280px] bg-white justify-center items-center"
        >
          <div className="font-black text-7xl">+</div>
          <div className="text-center font-semibold">Tambahkan Zona Blok</div>
        </div>
      </div>
      <Sidebar active={2} />

      {/* Modal for adding/editing zone */}
      {isModalOpen && (
        <ModalForm
          open={isModalOpen}
          onClose={closeModal}
          title={formValues.id ? "Edit Zone" : "Add Zone"}
          fields={fields}
          values={formValues}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onFieldChange={handleFieldChange}
        />
      )}
    </main>
  );
}
