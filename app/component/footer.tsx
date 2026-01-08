"use client";

import Link from "next/link";

const Footer = () => {
    return (
        <footer className="w-full bg-slate-900 text-slate-300 mt-10">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand */}
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        Medilife DMS
                    </h2>
                    <p className="text-sm mt-3 leading-relaxed">
                        Medilife Doctor Management System helps clinics and hospitals
                        manage doctors, patients, and appointments efficiently.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                        Quick Links
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/dashboard" className="hover:text-white">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/doctors" className="hover:text-white">
                                Doctors
                            </Link>
                        </li>
                        <li>
                            <Link href="/patient" className="hover:text-white">
                                Patients
                            </Link>
                        </li>
                        <li>
                            <Link href="/appointments" className="hover:text-white">
                                Appointments
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                        Support
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/contact" className="hover:text-white">
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/privacy-policy" className="hover:text-white">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link href="/terms" className="hover:text-white">
                                Terms & Conditions
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-slate-700 text-center py-4 text-sm">
                © {new Date().getFullYear()} Medilife DMS. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
