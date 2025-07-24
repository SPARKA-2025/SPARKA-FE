"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Tooltip } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ProfileIcon from "/public/assets/icon/profile.svg";
import DashboardIcon from "/public/assets/icon/dashboard.svg";
import BookingIcon from "/public/assets/icon/booking.svg";
import MonitoringIcon from "/public/assets/icon/monitoring.svg";
import ReportIcon from "/public/assets/icon/report.svg";
import fetchApi from "../lib/fetch/fetchApi";
import logoutHandler from "../lib/action/admin/logout";
import NotificationBell from "./NotificationBell";

export default function Sidebar({ active = 0 }) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("Admin");
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Set username from cookie after component mounts to avoid hydration mismatch
    const cookieUsername = Cookies.get("username");
    if (cookieUsername) {
      setUsername(cookieUsername);
    }
  }, []);

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
    
    // Hapus cookies terlebih dahulu
    Cookies.remove("token");
    Cookies.remove("username");
    
    // Tampilkan toast sukses
    toast.success("Berhasil keluar", {
      position: "top-center",
      autoClose: 1500,
    });
    
    // Redirect setelah delay singkat
    setTimeout(() => {
      router.push("/admin/login");
    }, 1600);
    
  } catch (error) {
    console.error("Gagal keluar:", error);
    toast.error("Gagal keluar: " + (error.message || "Terjadi kesalahan"), {
      position: "top-center",
      autoClose: 3000,
    });
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

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <NotificationBell />
        
        {/* Admin Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
              className="flex items-center gap-3 text-white cursor-pointer px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <ProfileIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-white">{username}</span>
              <span className="text-xs text-blue-100">Administrator</span>
            </div>
            <svg
              className={`w-4 h-4 text-white transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-800">{username}</p>
                <p className="text-xs text-gray-500">Administrator SPARKA</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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
                <span className="font-medium">Keluar</span>
              </button>
            </div>
          )}
        </div>
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