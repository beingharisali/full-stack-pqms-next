"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/user" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-2xl font-bold">
            <Link href="/">MyLogo</Link>
          </div>
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-white text-gray-900 shadow-md"
                    : "hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex">
            <button
              onClick={onLogout}
              className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>  
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? "X" : "≡"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-3 bg-gray-900 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${
                pathname === link.href
                  ? "bg-white text-gray-900 shadow-md"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-md bg-white text-gray-900 font-medium hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
