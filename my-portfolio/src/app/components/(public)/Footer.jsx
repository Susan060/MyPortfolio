'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone } from "lucide-react";

const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const LinkedinIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
);

const QUICK_LINKS_1 = [
    { label: "Home", href: "/" },
    { label: "About Me", href: "/about" },
    { label: "Case-Studies", href: "/case-studies" },
    { label: "Contact", href: "/contact" },
];

const SUPPORT_LINKS = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
];

const CONTACT_INFO = [
    { icon: <Phone size={16} />, text: "9818683813", href: "tel:9818683813" },
    { icon: <Mail size={16} />, text: "sushantadhikari060@gmail.com", href: "mailto:sushantadhikari060@gmail.com" },
];

const SOCIAL_LINKS = [
    { href: "https://www.facebook.com/sushant.adhikari.927", label: "Facebook", icon: <FacebookIcon /> },
    { href: "https://www.linkedin.com/in/susan-adhikari-4a084936b/", label: "LinkedIn", icon: <LinkedinIcon /> },
    { href: "https://instagram.com", label: "Instagram", icon: <InstagramIcon /> },
];

export default function Footer() {
    const pathname = usePathname();
    if (pathname.startsWith('/admin')) return null;
    if (pathname.startsWith('/login')) return null;

    return (
        <footer className="bg-white border-t border-gray-100 font-[Sora,sans-serif]">
            <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />

            <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">

                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">

                    {/* Brand */}
                    <div className="md:col-span-1 flex flex-col gap-5">
                        <Link href="/" className="flex items-center gap-2.5 no-underline w-fit">
                            <div className="w-9 h-9 bg-[#2a7a8a] rounded-lg flex items-center justify-center shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9l5 3-5 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="13" y1="15" x2="18" y2="15" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-[1.3rem] font-bold text-gray-900 tracking-tight">
                                Susan<span className="text-[#2a7a8a]">.dev</span>
                            </span>
                        </Link>

                        <p className="text-[0.88rem] text-gray-500 leading-relaxed max-w-55">
                            Crafting high-performance digital solutions with a focus on clean architecture and premium user experience.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[0.95rem] font-bold text-gray-900">Quick Links</h3>
                        <ul className="flex flex-col gap-3.5 list-none m-0 p-0">
                            {QUICK_LINKS_1.map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-[0.92rem] text-gray-500 hover:text-gray-900 no-underline transition-colors duration-150">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[0.95rem] font-bold text-gray-900">Support</h3>
                        <ul className="flex flex-col gap-3.5 list-none m-0 p-0">
                            {SUPPORT_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-[0.92rem] text-gray-500 hover:text-gray-900 no-underline transition-colors duration-150">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[0.95rem] font-bold text-gray-900">Contact</h3>
                        <ul className="flex flex-col gap-3.5 list-none m-0 p-0">
                            {CONTACT_INFO.map(({ icon, text, href }) => (
                                <li key={text}>
                                    <Link href={href} className="flex items-center gap-3 text-[0.92rem] text-gray-500 hover:text-gray-900 no-underline transition-colors duration-150">
                                        <span className="text-gray-400 shrink-0">{icon}</span>
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Social icons */}
                        <div className="flex items-center gap-3 mt-1">
                            {SOCIAL_LINKS.map(({ href, label, icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    target="_blank"
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-[#1e6a7a] transition-colors duration-150 no-underline"
                                >
                                    {icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Bottom bar */}
                <div className="flex items-center justify-center pt-6">
                    <p className="text-sm text-gray-400 text-center m-0">
                        © {new Date().getFullYear()} Susan Adhikari. All rights reserved. Crafted with precision.
                    </p>
                </div>

            </div>
        </footer>
    );
}