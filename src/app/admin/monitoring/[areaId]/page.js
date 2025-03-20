"use client";

import { useState, useEffect } from "react";
import fetchApi from "@/app/lib/fetch/fetchApi";
import Sidebar from "@components/Sidebar";
import { useRouter } from "next/navigation";
import Card from "@/app/_components/Card";
import ModalForm from "@/app/_components/admin/ModalForm"; // ModalForm component
import { toast } from "react-toastify";

export default function Main({ params }) {
  const { areaId } = params;
  const [blockList, setBlockList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For managing modal visibility
  const [formValues, setFormValues] = useState({
    id: null,
    nama: "",
    panjang: "",
    lebar: "",
    deskripsi: "",
  }); // For managing form values
  const router = useRouter();

  useEffect(() => {
    fetchApi({
      endpoint: `/admin/fakultas/${areaId}/blok`,
    }).then((res) => {
      setBlockList(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {blockList.map((block, index) => (
          <Card
            key={index}
            title={block.nama}
            desc={block.deskripsi}
            href={`/admin/monitoring/${areaId}/${block.id}`}
            onEditClick={() => openModal(block)} // Edit block on click
          />
        ))}
        <div
          onClick={() => openModal()} // Add new block
          className="w-full h-fit flex flex-wrap cursor-pointer mx-2 p-8 rounded-xl shadow-lg text-primary flex-col mb-6 min-h-[280px] bg-white justify-center items-center"
        >
          <div className="font-black text-7xl">+</div>
          <div className="tect-center font-semibold">Tambahkan Zona Blok</div>
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
