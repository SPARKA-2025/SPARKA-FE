"use client";

import Sidebar from "@components/Sidebar";
import { useState, useEffect } from "react";
import fetchApi from "@/app/lib/fetch/fetchApi";
import { API_CONFIG } from "@/app/lib/config/apiConfig";
import Image from "next/image";

export default function Main() {
  const [log, setLog] = useState([]);
  const [image, setImage] = useState(false);

  useEffect(() => {
    fetchApi({
      endpoint: "/admin/get-log-kendaraan",
    }).then((res) => {
      setLog(res.data);
    });
  }, []);

  function ImageModal() {
    const getImageSrc = () => {
      if (!image) return null;
      
      console.log('Image data received:', image, 'Type:', typeof image, 'Length:', image?.length);
      
      // Jika image adalah object dengan id (dari log kendaraan)
      if (typeof image === 'object' && image.id) {
        console.log('Using log kendaraan ID for image endpoint');
        return `${API_CONFIG.BASE_URL}/images/log-kendaraan/${image.id}`;
      }
      
      // Jika sudah dalam format base64 dengan prefix
      if (typeof image === 'string' && image.startsWith('data:')) {
        console.log('Using base64 with prefix');
        return image;
      }
      
      // Jika hanya string base64 tanpa prefix (panjang > 50 karakter dan tidak mengandung karakter path)
      if (typeof image === 'string' && image.length > 50 && 
          !image.includes('/') && !image.includes('\\') && 
          !image.includes(' ') && /^[A-Za-z0-9+/=]+$/.test(image)) {
        console.log('Using base64 without prefix');
        return `data:image/jpeg;base64,${image}`;
      }
      
      console.log('No valid image format found');
      // Fallback untuk format lain
      return null;
    };

    const imageSrc = getImageSrc();

    return (
      <div
        onClick={() => setImage(false)}
        className="w-screen h-screen fixed z-10 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="w-[400px] h-[280px] lg:w-[700px] lg:h-[500px] border-slate-500 border relative bg-white rounded-lg overflow-hidden">
          {imageSrc ? (
            <Image 
              fill 
              alt="capture" 
              src={imageSrc}
              className="object-contain"
              onError={(e) => {
                console.error('Error loading image:', e);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <div className="text-lg font-semibold mb-2">Gambar Tidak Tersedia</div>
                <div className="text-sm">Frame gambar untuk kendaraan yang terdeteksi AI</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setImage(false)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white-smoke h-screen justify-center flex relative flex-wrap pt-6 overflow-y-auto">
      {image && <ImageModal />}
      <div className="w-full h-full block bg-white m-[4%] mt-[10%] p-[4%] text-gray-900 text-base">
        <span className="text-primary font-bold text-2xl divide-y-2">
          Laporan Parkir
          <hr className="h-px my-8 bg-gray-700 border-0 dark:bg-gray-700" />
        </span>
        <div className="w-full overflow-x-auto">
      <table className="w-full border-gray-300">
        <thead className="border-y-2 border-gray-300">
          <tr>
            <th className="px-4 py-2">No.</th>
            <th className="px-4 py-2">Capture Time</th>
            <th className="px-4 py-2">Exit Time</th>
            <th className="px-4 py-2">Vehicle</th>
            <th className="px-4 py-2">Plate Number</th>
            <th className="px-4 py-2">Gambar</th>
          </tr>
        </thead>
        <tbody>
          {log?.map((item, index) => (
            <tr key={index} className="hover:bg-slate-200">
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td className="px-4 py-2 text-center">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-center">
                {item.exit_time ? new Date(item.exit_time).toLocaleDateString() : '-'}
              </td>
              <td className="px-4 py-2 text-center">{item.vehicle}</td>
              <td className="py-2 text-center">{item.plat_nomor}</td>
              <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setImage(item)}
                    className="text-sky-500 cursor-pointer hover:text-sky-700"
                  >
                    <u>Lihat Gambar</u>
                  </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>      </div>
      <Sidebar active={3} />
    </main>
  );
}
