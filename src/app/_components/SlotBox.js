import statusEnum from "../lib/utils/enum/statusEnum";

export default function SlotBox({
  x = 0,
  y = 0,
  size = "100%",
  draggable = false,
  className = "",
  id = "SlotBox",
  status = "Kosong",
  isActive,
  onClick,
}) {
  // const statusEnum = {
  //   Kosong: { style: { color: "white", border: "gray" } }, // Kosong
  //   Terisi: { style: { color: "gray", border: "darkgray" } }, // Terisi
  //   Dibooking: { style: { color: "red", border: "darkred" } }, // Dibooking
  //   Active: { style: { color: "blue", border: "darkblue" } }, // Active
  // };

  // const numericalStatus =
  //   status === "Terisi" ? 2 : status === "Dibooking" ? 3 : 0;

  // Gaya dinamis
  const styles = {
    backgroundColor: isActive
      ? statusEnum.find((item) => item.label === 'Dipilih').style.color
      : statusEnum.find( (item) => item.label === status).style.color,
    borderColor: isActive
      ? statusEnum.find((item) => item.label === 'Dipilih').style.border
      : statusEnum.find( (item) => item.label === status).style.border,
    width: size,
    height: size,
    // top: y,
    // left: x,
    gridRow: y,
    gridColumn: x,
  };

  // Elemen
  return (
    <div
      draggable={draggable}
      id={id}
      onClick={onClick}
      style={styles}
      className={`rounded-md border-2 size-auto min-h-8 min-w-8 max-h-12 max-w-12 aspect-square text-black ${className}`}
    ></div>
  );
}
