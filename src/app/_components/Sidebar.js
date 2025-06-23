"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Tooltip } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import ProfileIcon from "/public/assets/icon/profile.svg";
import DashboardIcon from "/public/assets/icon/dashboard.svg";
import BookingIcon from "/public/assets/icon/booking.svg";
import MonitoringIcon from "/public/assets/icon/monitoring.svg";
import ReportIcon from "/public/assets/icon/report.svg";
import fetchApi from "../lib/fetch/fetchApi";
import logoutHandler from "../lib/action/admin/logout";

export default function Sidebar({ active = 0 }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const username = Cookies.get("username") || "Admin";

  const menuItems = [
    { label: "Dashboard", icon: DashboardIcon, href: "/admin" },
    { label: "Booking", icon: BookingIcon, href: "/admin/booking" },
    { label: "Monitoring", icon: MonitoringIcon, href: "/admin/monitoring" },
    { label: "Laporan", icon: ReportIcon, href: "/admin/laporan" },
    { label: "Add Admin", icon: ProfileIcon, href: "/admin/register-admin" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
  try {
    const response = await logoutHandler();

    if (response?.message && response?.message !== "success") {
      throw new Error(response.message);
    }
    Cookies.remove("token");
    Cookies.remove("username");
    router.push("/admin/login");
    alert("Berhasil keluar.");

  } catch (error) {
    console.error("Gagal keluar:", error);
    alert("Gagal keluar: " + error.message);
  }
};

  const TopBar = () => (
    <div className="fixed top-0 w-full h-[72px] bg-white shadow-md px-6 py-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <Image
          src="/assets/img/unnesxsparka-colour.svg"
          alt="Logo SPARKA"
          width={250}
          height={40}
        />
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 text-gray-600 cursor-pointer px-4 py-1 bg-primary rounded hover:opacity-90 transition-all"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <ProfileIcon className="h-5 w-5 text-white" />
          <span className="text-sm font-medium text-white">{username}</span>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-md z-50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7"
                />
              </svg>
              Keluar
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const LeftBar = () => (
    <aside className="md:flex fixed z-30 bg-gray-700 h-[45vh] w-16 flex-col justify-between items-center p-2 left-0 top-1/4 rounded-e-3xl">
      <nav className="flex flex-col justify-evenly items-center h-full text-gray-50">
        {menuItems.map((item, index) => {
          const isActive = active === index;
          return (
            <Link href={item.href} key={item.label}>
              <Tooltip
                title={item.label}
                arrow
                placement="right"
                enterDelay={200}
                leaveDelay={150}>
                <div
                  className={`cursor-pointer p-2 rounded-lg ${
                    isActive ? "bg-gray-500" : "hover:bg-gray-600"
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
              </Tooltip>
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <>
      <LeftBar />
      <TopBar />
    </>
  );
}