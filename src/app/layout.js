import { Inter, Dongle } from "next/font/google";
import "./globals.css";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });
const dongle = Dongle({ subsets: ["latin"], weight: "300" });

export const metadata = {
  title: "Sparka",
  description: "Smart Parking Dashboard for UNNES",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
        {children}
        </body>
    </html>
  );
}
