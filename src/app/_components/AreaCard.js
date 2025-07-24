import Image from "next/image";
import defaultBase64Image from "../lib/utils/dummy/imageBase64";
import { useRouter } from "next/navigation";

const defaultDesc =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat";

export default function AreaCard({
  title = "Judul",
  href = "#",
  desc = defaultDesc,
  imageBase64,
  onEditClick,
  slotStats = null
}) {

  const router = useRouter()
  return (
    <div
      onClick={() => router.push(href)}
      className="w-full max-w-[300px] min-w-[250px] mx-auto p-0 m-3 rounded-xl overflow-hidden shadow-xl bg-white cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : defaultBase64Image}
          alt="Faculty image"
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Overlay Statistik Slot Parkir */}
        {slotStats && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-white/95 backdrop-blur-md rounded-lg p-2 shadow-sm border border-white/20">
              <div className="flex justify-between items-center gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold text-green-700">{slotStats.kosong || 0}</div>
                  <div className="text-green-600 font-medium">Kosong</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-red-700">{slotStats.terisi || 0}</div>
                  <div className="text-red-600 font-medium">Terisi</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-yellow-700">{slotStats.dibooking || 0}</div>
                  <div className="text-yellow-600 font-medium">Booking</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col h-[220px]">
        <h2 className="text-lg font-bold mb-2 text-primary line-clamp-2 min-h-[56px] flex items-start">{title}</h2>
        <p className="text-gray-600 text-xs mb-3 leading-relaxed line-clamp-3 flex-1">
          {desc}
        </p>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-auto">
          <button 
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm px-4 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105" 
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(e);
            }}
          >
            Edit
          </button>
          <span className="bg-green-700 hover:bg-green-800 text-white font-medium text-sm px-4 py-2 rounded-md shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105">
            Buka Area
          </span>
        </div>
        </div>
    </div>
  );
}
