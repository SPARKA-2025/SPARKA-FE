import HomeIcon from "/public/assets/icon/home.svg";
import HistoryIcon from "/public/assets/icon/history.svg";
import ProfileIcon from "/public/assets/icon/profile.svg";
import ButtonIcon from "./ButtonIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ active = 0 }) {
  const inactiveIcon = "fill-current text-primary w-auto h-[120%]";
  const activeIcon = "w-auto h-[100%] bg-primary rounded-md";
  const navbarIcon = [
    { Icon: HomeIcon },
    { Icon: HistoryIcon },
    { Icon: ProfileIcon },
  ];
  const navbarRoute = ["/", "/transaksi", "/profile"];

  return (
    <div className="bg-white bottom-0 fixed flex w-full h-[8%] items-center justify-center gap-[21%] rounded-t-lg shadow-[10_0px_10px_10px_rgba(0,0,0,0.3)]">
      {navbarIcon.map((key, index) => (
        <div key={key} className="h-[60%]">
          <ButtonIcon
            icon={
              <key.Icon
                className={active === index ? activeIcon : inactiveIcon}
              />
            }
            isActive={active === index}
            href={navbarRoute[index]}
          />
        </div>
      ))}
    </div>
  );
}
