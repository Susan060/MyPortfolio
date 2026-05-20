'use client'
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Case-Studies", href: "/case" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;
  if (pathname.startsWith("/login")) return null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 font-[Sora,sans-serif] backdrop-blur-md bg-white/80 transition-shadow duration-300 ${
          scrolled ? "shadow-md shadow-black/5" : "shadow-sm shadow-black/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-[#2a7a8a] rounded-lg flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l5 3-5 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="13" y1="15" x2="18" y2="15" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[1.3rem] font-bold tracking-tight text-gray-900">
              Susan<span className="text-[#2a7a8a]">.dev</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`relative block px-4 py-2 text-[0.92rem] font-medium rounded-md no-underline transition-colors duration-150
                    ${isActive
                      ? "text-gray-900 font-semibold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-0.5 after:bg-[#2a7a8a] after:rounded-full"
                      : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  {label}
                </Link>
              );
            })}

            <Link
              href="/contact"
              className="ml-2 flex items-center px-5 py-2.5 bg-[#2a7a8a] hover:bg-[#235f6e] text-white text-[0.88rem] font-semibold rounded-full no-underline transition-colors duration-150"
            >
              Contact Me
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex md:hidden flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-800 rounded transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-800 rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-800 rounded transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 pb-4 pt-2 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-[0.93rem] font-medium no-underline transition-colors duration-150
                    ${isActive
                      ? "text-[#2a7a8a] bg-[#2a7a8a]/10 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {label}
                </Link>
              );
            })}

            <Link
              href="/contact"
              className="mt-1 px-5 py-2.5 bg-[#2a7a8a] hover:bg-[#235f6e] text-white text-[0.9rem] font-semibold rounded-full no-underline text-center transition-colors duration-150"
            >
              Contact Me
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}