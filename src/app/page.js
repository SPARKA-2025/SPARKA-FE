"use client";
import Image from "next/image";
import Link from "next/link";
import BookingIcon from "@icon/book.svg";
import MonitorIcon from "@icon/monitor.svg";
import ReportIcon from "@icon/report.svg";
import Clock from "@icon/clock.svg";
import ShieldCheck from "@icon/shield-check.svg";
import Eye from "@icon/eye.svg";
import Wallet from "@icon/wallet.svg";
import Leaf from "@icon/leaf.svg";
import BrainCircuit from "@icon/brain-circuit.svg";

export default function Home() {
  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const offset = -60;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset + offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime = null;

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const run = startPosition + distance * easeInOutQuad(progress);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  }

  function Header() {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white text-gray-700 py-4 px-6 md:px-20 flex justify-between items-center shadow-md z-50 h-16">
        <div className="flex items-center gap-2">
          <Image src="/assets/img/unnesxsparka-colour.svg" alt="Logo SPARKA" width={250} height={40} />
        </div>
        <nav className="hidden md:flex gap-20">
          {["masthead", "about", "why-choose", "services", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-lg font-medium hover:text-primary transition-colors"
            >
              {section === "masthead"
                ? "Beranda"
                : section === "about"
                ? "Tentang"
                : section === "why-choose"
                ? "Keunggulan"
                : section === "services"
                ? "Layanan"
                : "Kontak"}
            </button>
          ))}
        </nav>
        <div className="hidden md:flex gap-4">
          <Link
            href="/login"
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors"
          >
            Masuk
          </Link>
        </div>
      </header>
    );
  }

  function Masthead() {
    return (
      <section
        id="masthead"
        className="relative w-full min-h-screen pt-16 text-white flex flex-col items-center justify-center text-center px-6"
      >
        <Image src="/assets/img/masthead.png" alt="Latar Parkir" fill className="object-cover -z-10" />
        <div className="absolute inset-0 bg-black/60 -z-5" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <Image src="/assets/img/sparka-logo-square.svg" alt="Logo SPARKA Kotak" width={200} height={50} className="mx-auto" />
          <h1 className="text-4xl md:text-6xl font-bold bg-black/40 px-6 py-4 rounded-xl shadow-md backdrop-blur-sm">
            Selamat Datang di SPARKA
          </h1>
          <p className="text-base md:text-xl leading-relaxed bg-black/30 px-6 py-4 rounded-lg shadow-md backdrop-blur-sm">
            Sistem parkir pintar yang membantu Anda menemukan dan mengelola tempat parkir secara real-time, efisien, dan tanpa stres.
          </p>
          <Link
            href="/admin"
            className="inline-block mt-4 bg-primary px-8 py-3 rounded-full text-white font-semibold text-base md:text-lg hover:bg-primary-dark transition-colors shadow-lg"
          >
            Dashboard Admin
          </Link>
        </div>
      </section>
    );
  }

  function AboutSection() {
    return (
      <section id="about" className="min-h-screen pt-16 px-6 md:px-20 bg-white flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            <span className="border-b-4 border-primary pb-1">Tentang Kami</span>
          </h2>
          <h3 className="text-2xl font-semibold mb-6">Sistem Parkir Pintar SPARKA</h3>
          <p className="text-gray-700 mb-5 leading-relaxed text-lg">
            SPARKA adalah sistem parkir pintar untuk memudahkan Anda menemukan dan mengelola tempat parkir secara cepat dan efisien.
            Dengan teknologi canggih, kami memberikan informasi terkini tentang ketersediaan parkir sehingga dapat menghemat waktu dan
            mengurangi stres saat mencari tempat parkir.
          </p>
          <p className="text-gray-700 mb-8 leading-relaxed text-lg">
            Sistem kami mengintegrasikan sensor, aplikasi mobile, dan dashboard real-time untuk memastikan pengalaman parkir yang nyaman dan aman.
            Kami juga berkomitmen untuk mendukung pengurangan kemacetan dan emisi karbon dengan mengoptimalkan penggunaan ruang parkir yang ada.
          </p>
          <Link href="/login" className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-colors inline-block font-medium">
            Masuk
          </Link>
        </div>
        <div className="flex-1 max-w-xl ml-auto">
          <Image src="/assets/img/about_app.svg" alt="Tentang" width={700} height={350} className="mx-auto" />
        </div>
      </section>
    );
  }

  function WhyChooseSection() {
    const reasons = [
      { icon: Clock, title: "Efisiensi Waktu", description: "Cari parkir lebih cepat tanpa perlu berputar-putar. SPARKA menghemat waktumu setiap hari." },
      { icon: ShieldCheck, title: "Keamanan Terjamin", description: "Sistem pengawasan dan pelacakan memastikan kendaraanmu aman selama parkir." },
      { icon: Eye, title: "Pemantauan Real-time", description: "Pantau kondisi parkir secara langsung dari aplikasi maupun dashboard SPARKA." },
      { icon: Wallet, title: "Hemat Biaya", description: "Tarif parkir yang transparan dan pemesanan efisien menghindarkan dari biaya tak terduga." },
      { icon: Leaf, title: "Ramah Lingkungan", description: "Kurangi emisi dengan sistem yang mengarahkan langsung ke lokasi parkir kosong." },
      { icon: BrainCircuit, title: "Terintegrasi Cerdas", description: "Terkoneksi dengan sistem kota pintar untuk pengalaman parkir adaptif dan modern." },
    ];

    return (
      <section id="why-choose" className="min-h-screen py-24 px-6 md:px-20 bg-white flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
          <span className="border-b-4 border-primary pb-2">Kenapa Memilih SPARKA?</span>
        </h2>
        <p className="text-gray-700 max-w-3xl mb-16 text-lg leading-relaxed">
          SPARKA adalah solusi parkir masa kini yang menggabungkan kecepatan, keamanan, dan kemudahan dalam satu sistem terintegrasi.
        </p>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white text-gray-800 rounded-2xl p-8 flex flex-col items-center text-center transition-shadow hover:shadow-lg">
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-primary">
                <Icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold border-primary pb-2">{title}</h3>
              <p className="text-base leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function ServiceSection() {
    const services = [
      {
        icon: BookingIcon,
        title: "Pemesanan",
        description:
          "Dapatkan pembaruan instan tentang ketersediaan parkir, sehingga Anda bisa memesan tempat dengan mudah dan menghindari antrian panjang.",
      },
      {
        icon: MonitorIcon,
        title: "Pemantauan",
        description:
          "Pantau area parkir secara real-time dengan dashboard kami yang mudah digunakan untuk memastikan keamanan & kenyamanan parkir Anda.",
      },
      {
        icon: ReportIcon,
        title: "Pelaporan",
        description:
          "Terima laporan lengkap aktivitas parkir harian dan bulanan yang membantu Anda dalam pengelolaan dan perencanaan yang lebih baik.",
      },
    ];

    return (
      <section id="services" className="min-h-screen flex flex-col justify-center bg-white text-gray-800 py-24 px-6 md:px-20">
        <h2 className="text-center text-3xl md:text-5xl font-bold mb-8 text-primary">
          <span className="border-b-4 border-primary pb-2">Layanan Kami</span>
        </h2>
        <p className="max-w-3xl mx-auto text-center mb-16 text-gray-700 leading-relaxed text-lg">
          Kami menyediakan tiga layanan utama yang dirancang untuk memberikan pengalaman parkir terbaik bagi pengguna dan pengelola.
        </p>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {services.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-primary text-white rounded-2xl p-8 flex flex-col items-center text-center transition-shadow hover:shadow-lg">
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-white">
                <Icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-base leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function Footer() {
    function scrollTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
      <footer id="contact" className="bg-primary text-white py-12 px-6 md:px-20 relative">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="flex flex-col max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/assets/img/unnesxsparka-white.svg" alt="UNNES" width={300} height={40} />
            </div>
            <p className="text-sm leading-relaxed">
              SPARKA adalah solusi parkir pintar yang dikembangkan oleh UNNES untuk mempermudah pengelolaan dan pemantauan parkir dengan lebih efisien.
            </p>
          </div>
          <div className="text-sm leading-relaxed">
            <h4 className="font-bold mb-2">Kampus UNNES Sekaran</h4>
            <p>
              Gunungpati, Semarang 50229
              <br />
              Jawa Tengah, Indonesia
              <br />
              +62 24 86008700
              <br />
              humas@mail.unnes.ac.id
            </p>
          </div>
        </div>
        <button
          onClick={scrollTop}
          aria-label="Gulir ke atas"
          className="absolute z-50 right-6 bottom-20 bg-white text-primary rounded-full p-4 shadow-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110"
        >
          ↑
        </button>
        <div className="text-center mt-12 text-xs text-white/60">
          &copy; {new Date().getFullYear()} SPARKA — All rights reserved.
        </div>
      </footer>
    );
  }

  return (
    <main className="w-full scroll-smooth" style={{ scrollPaddingTop: "64px" }}>
      <Header />
      <Masthead />
      <AboutSection />
      <hr className="border-t border-gray-400 mx-auto w-4/4" />
      <WhyChooseSection />
      <hr className="border-t border-gray-400 mx-auto w-4/4" />
      <ServiceSection />
      <Footer />
    </main>
  );
}
