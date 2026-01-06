"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const links = [
    { name: "Home", href: "/user" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-wide">
            <img
              src="	https://preview.colorlib.com/theme/medilife/img/core-img/logo.png"
              alt=""
              className="w-"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${
                    pathname === link.href
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:flex">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-700/60 transition"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-800 to-gray-900 px-4 pb-4 space-y-2 shadow-2xl">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition
                ${
                  pathname === link.href
                    ? "bg-white text-gray-900"
                    : "text-gray-300 hover:bg-gray-700/60 hover:text-white"
                }
              `}
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
