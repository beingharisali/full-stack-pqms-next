"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { name: "ADMIN", href: "/admin" },
        { name: "DOCTOR", href: "/doctor" },
    ];

    return (
        <div className="w-48 bg-gray-900 text-white h-screen p-4 shadow-md">
            <h1 className="text-xl font-bold mb-6 text-center">Menu</h1>
            <nav className="flex flex-col gap-3">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href=""
                        className={`px-4 py-2 rounded-lg text-center font-medium transition-colors ${pathname === link.href
                            ? "bg-white text-gray-900"
                            : "hover:bg-gray-700 hover:text-white"
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
