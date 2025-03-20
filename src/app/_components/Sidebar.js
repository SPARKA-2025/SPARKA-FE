"use client";

import { Button, IconButton } from "@mui/material";
import Logo from "/public/assets/icon/logo.svg";
import ProfilIcon from "/public/assets/icon/profile.svg";
import DashboardIcon from "/public/assets/icon/dashboard.svg";
import BookingIcon from "/public/assets/icon/booking.svg";
import MonitoringIcon from "/public/assets/icon/monitoring.svg";
import ReportIcon from "/public/assets/icon/report.svg";
import OpenMenuIcon from "/public/assets/icon/menu.svg";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { decrypt } from "../lib/utils/service/decrypt";

export default function Sidebar({ active = 0 }) {
  const [openSide, setOpenSide] = useState(false);
  const username = Cookies.get("username");

  function TopBar() {
    return (
      <div className="bg-white top-0 fixed flex w-screen h-[72px] shadow-md py-4 px-[2%] justify-between">
        <div className=" flex gap-4 items-center w-auto relative">
          <Logo className="h-full" />
          <span className="text-primary font-bold text-3xl items-center">
            Sparka
          </span>
          <Button
            onClick={() => setOpenSide(!openSide)}
            className="text-primary flex text-center h-full hover:bg-gray-400"
          >
            <OpenMenuIcon className="h-[72%]" />
          </Button>
        </div>
        <div className=" flex gap-4 items-center w-auto">
          <div className="flex h-full items-center gap-1">
            <ProfilIcon className="text-gray-500 h-[80%] text-center" />
            <span className="text-gray-500 font-medium text-base text-center items-center">
              {username || 'Admin'}
            </span>
          </div>
          <Button
            variant="contained"
            color="primary"
            className="bg-primary w-fit h-[90%] px-2"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  function LeftBar() {
    const menuList = [
      {
        label: "Dashboard",
        icon: DashboardIcon,
        href: "/admin",
      },
      {
        label: "Booking",
        icon: BookingIcon,
        href: "/admin/booking",
      },
      {
        label: "Monitoring",
        icon: MonitoringIcon,
        href: "/admin/monitoring",
      },
      {
        label: "Report",
        icon: ReportIcon,
        href: "/admin/laporan",
      },
    ];

    return (
      <div className="bg-white left-0 top-0 fixed flex h-screen w-[28%] shadow-xl px-[2%]">
        <div className=" mt-[max(8%,72px)] pt-[8%] flex h-full flex-col w-full gap-4">
          {menuList.map((key, index) => (
            <div
              key={index}
              className={
                " w-full  items-center" +
                (active === index ? " bg-gray-300 rounded-sm" : " ")
              }
            >
              <Button
                startIcon={<key.icon className="text-primary w-8" />}
                href={key.href}
                className=" text-primary font-bold text-lg w-full h-12 justify-start"
              >
                {key.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full fixed z-[51]">
      {openSide && <LeftBar />}
      <TopBar />
    </div>
  );
}
