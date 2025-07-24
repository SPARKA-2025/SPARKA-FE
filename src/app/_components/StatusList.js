import statusEnum from "../lib/utils/enum/statusEnum";

export default function StatusList() {
  return (
    <div className="flex justify-around h-fit w-full gap-2 bg-white p-2 rounded-lg shadow-sm">
      {statusEnum.map((status, index) => (
        <div key={index} className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            {status.label}
          </span>
        </div>
      ))}
    </div>
  );
}