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
  onEditClick
}) {

  const router = useRouter()
  return (
    <div
      onClick={() => router.push(href)}
      className="w-[360px] min-w-[240px] max-w-[30%] mx-4 p-4 m-2 rounded-lg overflow-hidden shadow-lg bg-white cursor-pointer"
    >
      <div className="relative h-48">
        <Image
          src={imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : defaultBase64Image}
          alt="Faculty image"
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="px-4 pt-4 h-full relative">
        <h2 className="text-xl font-bold mb-2 text-primary h-[16%]">{title}</h2>
        <p className="text-gray-700 text-xs mb-4 hidden md:flex">{desc.length > 230 ? `${desc.slice(0,230)}...` : desc}</p>
        <p className="text-gray-700 text-base mb-4 w-full text-end bottom-0 gap-x-2">
          <span className="hover:bg-slate-100 rounded-md min-w-12 p-2" onClick={onEditClick}>
            Edit
          </span>
          <span className="hover:bg-slate-100 rounded-md min-w-12 p-2">
            Buka Area
          </span>
        </p>
      </div>
    </div>
  );
}
