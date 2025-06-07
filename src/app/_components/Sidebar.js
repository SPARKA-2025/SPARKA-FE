"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, IconButton } from "@mui/material";
import Image from "next/image";
import Cookies from "js-cookie";

import ProfileIcon from "/public/assets/icon/profile.svg";
import DashboardIcon from "/public/assets/icon/dashboard.svg";
import BookingIcon from "/public/assets/icon/booking.svg";
import MonitoringIcon from "/public/assets/icon/monitoring.svg";
import ReportIcon from "/public/assets/icon/report.svg";
import MenuIcon from "/public/assets/icon/menu.svg";

export default function Sidebar({ active = 0 }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const username = Cookies.get("username") || "Admin";

  const menuItems = [
    { label: "Dashboard", icon: DashboardIcon, href: "/admin" },
    { label: "Booking", icon: BookingIcon, href: "/admin/booking" },
    { label: "Monitoring", icon: MonitoringIcon, href: "/admin/monitoring" },
    { label: "Laporan", icon: ReportIcon, href: "/admin/laporan" },
    { label: "Add Admin", icon: ProfileIcon, href: "/api/register-admin" },
  ];

  const handleMenuClick = (href) => {
    setSidebarOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    Cookies.remove("username");
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Topbar */}
      <div className="fixed top-0 w-full h-[72px] bg-white shadow-md px-6 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-200"
          >
            <MenuIcon className="h-6 w-6 text-primary" />
          </IconButton>
          <div className="transition-all duration-300 w-[200px]">
            <Image
              src="/assets/img/unnesxsparka-colour.svg"
              alt="Logo SPARKA"
              width={200}
              height={40}
              priority
            />
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer select-none bg-primary px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            <ProfileIcon className="h-5 w-5 text-white" />
            <span className="text-sm font-medium text-white">{username}</span>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-md border border-gray-200 z-50 overflow-hidden">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
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
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg pt-[88px] z-40 transition-all duration-300 ${
          sidebarOpen ? "w-[240px]" : "w-0"
        } overflow-hidden`}
      >
        {sidebarOpen && (
          <nav className="flex flex-col gap-2 px-4 animate-fade-in">
            {menuItems.map((item, index) => {
              const isActive = active === index;
              return (
                <div
                  key={item.label}
                  onClick={() => handleMenuClick(item.href)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? "bg-[#E3E7F3] font-bold text-primary"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <item.icon className="h-6 w-6 text-primary" />
                  <span className="text-base">{item.label}</span>
                </div>
              );
            })}
          </nav>
        )}
      </aside>

      {/* Animasi */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
