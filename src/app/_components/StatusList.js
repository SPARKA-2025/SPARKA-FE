import statusEnum from "../lib/utils/enum/statusEnum";

export default function StatusList() {
  return (
    <div className="flex justify-around h-fit w-full gap-2">
      {statusEnum.map((status, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-6 w-6 border-2"
            style={{
              backgroundColor: status.style.color,
              borderColor: status.style.border,
            }}
          ></div>
          <span className="text-2xl font-medium text-black">
            {status.label}
          </span>
        </div>
      ))}
    </div>
  );
}