const statusEnum = [
  {
    label: "Kosong",
    style: {
      color: "#22C55E", // Green for empty
      border: "#16A34A",
    },
  },
  {
    label: "Dipilih",
    style: {
      color: "#3B82F6", // Blue for selected
      border: "#2563EB",
    },
  },
  {
    label: "Terisi",
    style: {
      color: "#EF4444", // Red for occupied
      border: "#DC2626",
    },
  },
  {
    label: "Dibooking",
    style: {
      color: "#EAB308", // Yellow for booked
      border: "#CA8A04",
    },
  },
];

export default statusEnum;