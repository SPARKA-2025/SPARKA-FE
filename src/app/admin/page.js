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
      const res = await fetchApi({ endpoint: `/admin/fakultas` });
      setListFakultas(res.data);
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
    <main className="bg-white-smoke h-screen justify-start px-2 flex flex-wrap overflow-y-auto pt-[4%]">
      <div className="bg-white m-[4%] p-[4%] h-fit flex flex-wrap justify-evenly gap-x-1 w-[80%] mx-auto">
        {listFakultas.map((fakultas, index) => (
          <AreaCard
            key={index}
            title={fakultas?.nama || "Judul"}
            desc={fakultas?.deskripsi}
            href={`admin/monitoring/${fakultas.id}`}
            imageBase64={fakultas?.image}
            onEditClick={(e) => handleEditClick(e, fakultas)}
          />
        ))}
        <div className="flex w-full h-[256px] mb-12 py-2 justify-center">
          <div
            onClick={handleAddClick}
            className="w-full h-fit flex flex-wrap cursor-pointer mx-2 p-8 rounded-xl shadow-lg text-primary flex-col mb-6 min-h-[280px] bg-white justify-center items-center"
          >
            <div className="font-black text-7xl">+</div>
            <div className="text-center font-semibold">Tambahkan Fakultas</div>
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
