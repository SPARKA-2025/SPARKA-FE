import { Inter, Dongle } from "next/font/google";
import "./globals.css";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });
const dongle = Dongle({ subsets: ["latin"], weight: "300" });

export const metadata = {
  title: "SPARKA",
  description: "Sistem Parkir Pintar UNNES",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-white text-gray-800`}>
        {/* Global Toast Notification */}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

        {/* Page content */}
        <main className="w-full scroll-smooth">
          {children}
        </main>
      </body>
    </html>
  );
}
