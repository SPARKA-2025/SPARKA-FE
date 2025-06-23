import FacultyForm from "@/app/_components/admin/FacultyForm";
import Sidebar from "@/app/_components/Sidebar";

export default function Main({params}) {
  return (
    <div className="bg-white-smoke flex min-h-screen w-full">
      <Sidebar />
      <FacultyForm />
    </div>
  );
}
