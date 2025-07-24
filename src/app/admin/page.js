'use client';

import { useState, useEffect } from "react";
import fetchApi from "@/app/lib/fetch/fetchApi";
import Sidebar from "@components/Sidebar";
import AreaCard from "@/app/_components/AreaCard";
import ModalForm from "@/app/_components/admin/ModalForm";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Main() {
  const [listFakultas, setListFakultas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputData, setInputData] = useState({
    id: null,
    nama: "",
    deskripsi: "",
    image: null,
  });

  const fetchFakultas = async () => {
    try {
      const res = await fetchApi({ endpoint: `/admin/fakultas-with-statistics` });
      setListFakultas(res.data);
      
      // Data fakultas sudah termasuk statistik dari backend
    } catch (error) {
      console.error("Gagal mengambil data fakultas:", error);
    }
  };

  useEffect(() => {
    fetchFakultas();
  }, []);

  const handleAddClick = () => {
    setInputData({ id: null, nama: "", deskripsi: "", image: null });
    setShowModal(true);
  };

  const handleEditClick = (event, fakultas) => {
    event.stopPropagation();

    setInputData({
      id: fakultas.id,
      nama: fakultas.nama,
      deskripsi: fakultas.deskripsi,
      image: fakultas.image,
    });
    setShowModal(true);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setInputData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = inputData.id
        ? `/admin/fakultas/${inputData.id}`
        : `/admin/fakultas`;
      const method = "post";

      const formData = new FormData();
      const contentType = "multipart/form-data";

      formData.append("nama", inputData.nama);
      formData.append("deskripsi", inputData.deskripsi);
      if (inputData.image) formData.append("image", inputData.image);

      const res = await fetchApi({
        endpoint,
        method,
        data: formData,
        contentType,
      });

      if (res.status === "success") {
        toast.success(inputData.id ? "Fakultas berhasil diperbarui!" : "Fakultas berhasil ditambahkan!");
        fetchFakultas();
        setShowModal(false);
      } else {
        toast.error(`Gagal menyimpan fakultas. Silakan coba lagi.\n${JSON.stringify(res)}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim data fakultas.");
      console.error("Error submit fakultas:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const endpoint = `/admin/fakultas/${inputData.id}`;
      const method = "delete";

      const res = await fetchApi({ endpoint, method });

      if (res.status === "success") {
        toast.success("Fakultas berhasil dihapus!");
        fetchFakultas();
        setShowModal(false);
      } else {
        toast.error(`Gagal menghapus fakultas. Silakan coba lagi.\n${JSON.stringify(res)}`);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat menghapus fakultas:", error);
    }
  };

  return (
    <main className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen overflow-y-auto pt-[6%]">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Admin SPARKA</h1>
          <p className="text-gray-600">Kelola area parkir dan monitoring sistem</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {listFakultas.map((fakultas, index) => (
            <AreaCard
              key={index}
              title={fakultas?.nama || "Judul"}
              desc={fakultas?.deskripsi}
              href={`admin/monitoring/${fakultas.id}`}
              imageBase64={fakultas?.image}
              onEditClick={(e) => handleEditClick(e, fakultas)}
              slotStats={fakultas.statistics}
            />
          ))}
          
          <div
            onClick={handleAddClick}
            className="w-full min-h-[400px] flex flex-col cursor-pointer p-8 rounded-xl shadow-xl text-primary bg-white justify-center items-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-dashed border-gray-300 hover:border-primary"
          >
            <div className="font-black text-6xl mb-4 text-gray-400">+</div>
            <div className="text-center font-semibold text-lg text-gray-600">Tambahkan Fakultas</div>
            <div className="text-center text-sm text-gray-400 mt-2">Klik untuk menambah area baru</div>
          </div>
        </div>
      </div>

      {/* Modal Formulir Fakultas */}
      {showModal && (
        <ModalForm
          open={showModal}
          onClose={() => setShowModal(false)}
          title={inputData.id ? "Edit Fakultas" : "Tambah Fakultas"}
          values={inputData}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onFieldChange={handleFieldChange}
          onFileChange={handleFileChange}
          fields={[
            { name: "nama", label: "Nama Fakultas", type: "text", required: true },
            {
              name: "deskripsi",
              label: "Deskripsi Fakultas",
              type: "textarea",
              required: true,
              multiline: true,
              rows: 4,
            },
            { name: "image", label: "Gambar Fakultas", type: "file", required: inputData.id ? false : true },
          ]}
        />
      )}
      <Sidebar  />
    </main>
  );
}
