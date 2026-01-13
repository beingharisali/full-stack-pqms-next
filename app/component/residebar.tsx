"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/receptionist", icon: LayoutDashboard },
  ];

  const activePage =
    links.find((link) => pathname.startsWith(link.href))?.name || "Dashboard";

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 shadow-2xl border-r-white ">
      {/* Header */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold tracking-wide text-white border-b-2 border-blue-600">
          {activePage}
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
                }
              `}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
