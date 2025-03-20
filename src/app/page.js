import Image from "next/image";
import Link from "next/link";
import BookingIcon from "@icon/book.svg"
import MonitorIcon from "@icon/monitor.svg"
import ReportIcon from "@icon/report.svg"

export default function Home() {
  function Masthead() {
    return (
      <div className="w-full h-[70%] sm:h-[400px] md:h-screen flex text-white relative">
        <Image
          src={"/assets/img/masthead.png"}
          fill
          alt="masthead"
          className="w-full h-auto absolute -z-10"
        />
        <div className=" flex w-full h-full justify-center flex-col self-center items-center text-center px-[5%] pt-16 bg-gradient-to-t from-white to-40%">
          <span className="text-6xl md:text-8xl font-bold">Welcome to SPARKA</span>
          <span className="my-5 max-w-[40%] font-light text-sm md:text-lg">
          Parkir Cerdas, Anti Stres!
          </span>
          <Link
            href={"/admin"}
            className="bg-primary w-fit px-3 md:px-6 py-1 md:py-4 rounded-md font-medium text-sm md:text-xl"
          >
            Dasbor Admin
          </Link>
        </div>
      </div>
    );
  }

  function AboutSection() {
    return (
      <div className="flex bg-white px-4 py-6 items-start h-[360px] lg:h-[640px] w-auto rounded-md relative">
        <div className="flex relative h-full w-1/2">
          <Image
            fill
            src={"/assets/img/about_app.png"}
            alt="about"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col lg:mt-12 relative h-full w-1/2 min-w-[256px] text-primary py-4 px-6">
          <div className="font-semibold text-3xl lg:text-6xl w-fit relative">
            <span>About us</span>
            <div className="flex justify-center items-center h-fit">
              <hr className="absolute w-full" />
              <hr className="border-2 border-primary w-[30%] z-10 absolute" />
            </div>
          </div>
          <span className="text-xl lg:text-4xl mt-4 lg:mt-12 h-fit w-full items-center">
            Sparka adalah aplikasi smart parking system yang dikembangkan oleh
            unnestech. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.{" "}
          </span>
        </div>
      </div>
    );
  }

  function ServiceSection() {
    const serviceList = [
      {
        icon: BookingIcon,
        title: "Booking",
        description: "Dapatkan pembaruan instan tentang ketersediaan parkir, mengurangi kemacetan dan menghemat waktu.",
      },
      {
        icon: MonitorIcon ,
        title: "Monitoring",
        description: "Bayar parkir menggunakan aplikasi mobile, menghilangkan kebutuhan akan uang tunai atau tiket parkir.",
      },
      {
        icon: ReportIcon,
        title: "Report",
        description: "Dapatkan arahan ke tempat parkir yang tersedia, mengurangi kemacetan lalu lintas dan polusi.",
      },
    ];

    function ServiceCard({ Icon, title, description }) {
      const titleSize = title.length >= 5 ? ' text-xl md:text-2xl' : ' text-2xl md:text-4xl'
      const titleClass = "font-semibold text-2xl md:text-4xl" + titleSize
      return (
        <div className="flex flex-col bg-white px-4 py-6 items-start w-[30%] md:w-[24%] rounded-md shadow-2xl">
          <div className="flex flex-col mt-4 mb-2 w-full">
            <div className="flex justify-evenly items-center w-full">
              <div className="size-11">
                <Icon />
              </div>
              <span className={titleClass}>{title}</span>
            </div>
            <span className="text-sm hidden sm:block md:text-lg">{description}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white h-auto flex flex-col justify-around py-16 px-[5%]">
        <div className="flex flex-col gap-y-4 items-center text-center text-primary">
          <div className="font-semibold text-3xl md:text-6xl relative">
            <span>Services</span>
            <div className="flex justify-center items-center h-fit">
              <hr className="absolute w-full" />
              <hr className="border-2 border-primary w-[30%] z-10 absolute" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap w-full gap-y-12 md:gap-y-8 justify-evenly md:gap-[6%] md:justify-center text-primary mt-8">
          {serviceList.map((item) => (
            <ServiceCard
              key={item.title}
              Icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    );
  }

  function Footer() {
    const info = [
      {
        title: 'User',
        sub: [
          { title: 'Layanan', url: '#' },
          { title: 'Tentang', url: '#' },
          { title: 'FAQ', url: '#' },
        ]
      },
      {
        title: 'Operator',
        sub: [
          { title: 'Daftar Operator', url: '#' },
          { title: 'Kontak', url: '#' },
          // { title: 'Pricing', url: '#' },
        ]
      }
    ];
  
    function FooterPage({ title, sub }) {
      return (
        <div className="flex flex-col max-w-[30%] h-full gap-4">
          <span className="font-bold">{title}</span>
          <div>
            {sub.map((item) => (
              <div key={item.title} className="h-fit mb-8">
                <a href={item.url}>{item.title}</a>
              </div>
            ))}
          </div>
        </div>
      );
    }
  
    return (
      <div className="footer flex items-start justify-between h-[348px] bg-primary py-12 px-[5%] text-white">
        <div className="flex flex-col max-w-[30%] h-full">
          <div className="Logo font-bold text-xl text-background relative w-16 h-9 md:w-[88px] md:h-12">
            Sparka
          </div>
          <span>Capai karirmu dengan jalur yang cepat dan tepat.</span>
          <hr className="h-px my-8 bg-white border-0" />
          <div>sparka@gmail.com</div>
        </div>
          {info.map((item) => (
            <FooterPage key={item.title} title={item.title} sub={item.sub} />
          ))}
      </div>
    );
  }
  
  return (
    <div className="w-screen h-screen">
      <Masthead />
      <AboutSection />
      <ServiceSection />
      <Footer />
    </div>
  );
}
