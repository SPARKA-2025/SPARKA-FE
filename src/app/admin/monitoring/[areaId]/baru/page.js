import ZoneForm from "@/app/_components/admin/ZoneForm";
import Sidebar from "@/app/_components/Sidebar";

export default function Main({params}) {
    const { areaId } = params;

  return (
    <div className="bg-white-smoke flex min-h-screen w-full">
      <Sidebar />
      <ZoneForm areaId={areaId} />
    </div>
  );
}
