import BookForm from "@/app/_components/admin/BookForm";
import Sidebar from "@/app/_components/Sidebar";

export default function Main({params}) {
  const {slotId} = params
  return (
    <div className="bg-white-smoke flex min-h-screen w-full">
      <Sidebar />
      <BookForm slotId={slotId}/>
    </div>
  );
}
