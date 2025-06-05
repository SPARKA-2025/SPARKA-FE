import FacultyForm from "@/app/_components/admin/FacultyForm";
import Sidebar from "@/app/_components/Sidebar";

export default function Main({ params }) {
  return (
    <div className="flex min-h-screen bg-white-smoke">
      {/* Sidebar dengan lebar tetap */}
      <aside className="w-64 border-r border-gray-200">
        <Sidebar />
      </aside>

      {/* Konten utama, fleksibel, dengan padding */}
      <main className="flex-1 p-8">
        <FacultyForm />
      </main>
    </div>
  );
}
