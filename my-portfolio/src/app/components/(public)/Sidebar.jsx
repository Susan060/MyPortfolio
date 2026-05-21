'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'inquiries',
    label: 'Inquiries',
    href: '/admin/inquiries',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3,5 12,13 21,5" />
      </svg>
    ),
  },
  {
    id: 'audit-Request',
    label: 'Audit-Request',
    href: '/admin/auditRequest',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
  {
    id: 'blog',
    label: 'Blog Posts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="13" y2="16" />
      </svg>
    ),
    children: [
      { id: 'all-posts', label: 'All Posts', href: '/admin/blog' },
      { id: 'add-new', label: 'Add New', href: '/admin/blog/new' },
    ],
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    children: [
      { id: 'all-case-studies', label: 'All Case Studies', href: '/admin/case-studies' },
      { id: 'add-new-case-study', label: 'Add New', href: '/admin/case-studies/new' },
    ],
  },
  {
    id: 'categories',
    label: 'Categories',
    href: '/admin/blog/categories',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'tags',
    label: 'Tags',
    href: '/admin/blog/tags',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
];

function SidebarContent({ collapsed, setCollapsed, onNavClick }) {
  const pathname = usePathname();
  const router = useRouter();

  const [openMenus, setOpenMenus] = useState(() => {
    const open = {};
    if (pathname.startsWith('/admin/blog')) open.blog = true;
    if (pathname.startsWith('/admin/case-studies')) open['case-studies'] = true;
    return open;
  });

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isBlogActive = pathname.startsWith('/admin/blog');
  const isCaseStudyActive = pathname.startsWith('/admin/case-studies');

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-gray-100">
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
          <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
            <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-gray-900 leading-tight truncate">Susan</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest truncate">Admin Panel</span>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex w-7 h-7 rounded-lg items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all shrink-0 cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
            {collapsed ? (
              <polyline points="9,18 15,12 9,6" />
            ) : (
              <polyline points="15,18 9,12 15,6" />
            )}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <span className={`text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2 block transition-all duration-200 overflow-hidden ${collapsed ? 'opacity-0 h-0 mb-0' : 'opacity-100 h-4'}`}>
          Main Menu
        </span>

        {menuItems.map((item) => {
          // Items with children (dropdown)
          if (item.children) {
            const isOpen = openMenus[item.id];
            const isActive =
              item.id === 'blog' ? isBlogActive : isCaseStudyActive;

            return (
              <div key={item.id}>
                <button
                  onClick={() => !collapsed && toggleMenu(item.id)}
                  className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive
                      ? 'bg-red-50 text-red-500'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                >
                  <span className={`shrink-0 flex transition-colors ${isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                  </span>

                  <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 flex-1 text-left ${collapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
                    {item.label}
                  </span>

                  {!collapsed && (
                    <ChevronDown
                      size={14}
                      className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  )}

                  {collapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    </span>
                  )}
                </button>

                {isOpen && !collapsed && (
                  <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l-2 border-gray-100 pl-3">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.id}
                          href={child.href}
                          onClick={onNavClick}
                          className={`flex items-center px-2 py-2 rounded-lg text-sm transition-all duration-150
                            ${isChildActive
                              ? 'text-red-500 font-semibold bg-red-50'
                              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular item
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavClick}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
            >
              <span className={`shrink-0 flex transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </span>

              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
                {item.label}
              </span>

              {item.badge && !collapsed && (
                <span className={`ml-auto shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-red-500' : 'bg-red-100 text-red-500'}`}>
                  {item.badge}
                </span>
              )}

              {collapsed && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative shrink-0">
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="Admin User"
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-red-100"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          </div>

          <div className={`flex-1 overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
            <p className="text-sm font-semibold text-gray-800 truncate leading-tight">Admin User</p>
          </div>

          {!collapsed && (
            <button
              onClick={() => router.push('/')}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all cursor-pointer"
              aria-label="Logout"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen border-r border-gray-100 shadow-sm transition-all duration-300 shrink-0 sticky top-0 z-30 ${collapsed ? 'w-16' : 'w-56'}`}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onNavClick={() => { }}
        />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-white border border-gray-200 rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="15" y2="18" />
        </svg>
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-2xl transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-all cursor-pointer"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <SidebarContent
          collapsed={false}
          setCollapsed={() => { }}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
}