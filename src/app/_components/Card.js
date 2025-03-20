import Link from "next/link";

const styleVariables = {
  default: 'bg-white',
  'gradient-yellow': 'bg-gradient-to-r from-white from-45% to-yellow-400',
};

export default function Card({ title = 'Judul', href = '#', desc = 'Ini Deskripsi', bg = 'default', image, onEditClick }) {
  return (
    <div className="w-full h-fit flex flex-wrap justify-between mx-2">
      <div
        className={`w-full p-8 rounded-xl shadow-lg h-[28vh] text-primary flex flex-col justify-between mb-6 ${
          !image ? styleVariables[bg] : ""
        }`}
        style={
          image
            ? {
                backgroundImage: `data:image/jpg;base64,${image}`,
                backgroundSize: "cover",
              }
            : undefined
        }
      >
        <span className="font-bold text-2xl">{title}</span>
        <span className="text-sm">{desc}</span>
        <div className="mt-4 flex justify-end items-center gap-6 text-gray-700">

          <button
            onClick={onEditClick}
            className="  px-4 py-2 rounded-lg"
          >
            Edit
          </button>
          <Link href={href} >Buka</Link>        </div>
      </div>
    </div>
  );
}
