"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Send,
  X,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";

const API_BASE = `/api`;
const ITEMS_PER_PAGE = 5;

const STATUS_CONFIG = {
  unread: {
    label: "NEW",
    icon: Circle,
    className: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-500",
  },
  read: {
    label: "READ",
    icon: Eye,
    className: "bg-amber-50 text-amber-600 border border-amber-200",
    dot: "bg-amber-400",
  },
  replied: {
    label: "REPLIED",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    dot: "bg-emerald-500",
  },
};

const DATE_RANGES = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 90 Days", value: 90 },
  { label: "All Time", value: 0 },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unread;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${cfg.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

// ─── Detail Modal ────────────────────────────────────────────────
function DetailModal({ contact, onClose, onDelete, onReply }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
              {contact.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {contact.name}
              </h3>
              <p className="text-xs text-gray-400">{contact.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={contact.status} />
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-1"
            >
              <X size={15} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Topic
              </p>
              <p className="text-sm font-medium text-gray-800">{contact.topic}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800">{contact.phone}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Message
            </p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">
              {contact.message}
            </p>
          </div>

          {contact.reply && (
            <div>
              <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-2">
                Your Reply
              </p>
              <div
                className="text-sm text-gray-700 leading-relaxed bg-emerald-50 rounded-xl p-4 border border-emerald-100 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: contact.reply }}
              />
              {contact.replyImageUrl && (
                <img
                  src={contact.replyImageUrl}
                  alt="Reply attachment"
                  className="mt-3 rounded-xl max-h-48 object-cover"
                />
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Clock size={11} /> Received {formatDate(contact.createdAt)}
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
          <button
            onClick={() => {
              onDelete(contact._id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
          <button
            onClick={() => onReply(contact._id)}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors"
          >
            <Send size={13} />
            {contact.status === "replied" ? "Reply Again" : "Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function InquiriesPage() {
  const router = useRouter();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState(30);
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        credentials: "include",
      });
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/contact/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    if (contact.status === "unread") {
      setContacts((prev) =>
        prev.map((c) =>
          c._id === contact._id ? { ...c, status: "read" } : c
        )
      );
    }
  };

  // ← Navigate to reply page instead of opening modal
  const handleReply = (id) => {
    router.push(`/admin/inquiries/reply/${id}`);
  };

  // Filtering
  const now = new Date();
  const filtered = contacts.filter((c) => {
    const matchSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchRange =
      rangeFilter === 0 ||
      (now - new Date(c.createdAt)) / (1000 * 60 * 60 * 24) <= rangeFilter;
    return matchSearch && matchStatus && matchRange;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const rangeLabel =
    DATE_RANGES.find((r) => r.value === rangeFilter)?.label || "Last 30 Days";

  return (
    <div className="min-h-screen bg-[#f8f8f7] font-sans">
      <div className="px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Inquiries
            </h1>
            <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
              {filtered.length} Total
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Manage and respond to incoming lead messages.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-50 relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search inquiries by name, email, or content..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowRangeDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-400 transition-colors"
            >
              Status:{" "}
              {statusFilter === "all"
                ? "All"
                : STATUS_CONFIG[statusFilter]?.label}
              <ChevronLeft
                size={13}
                className={`transition-transform ${
                  showStatusDropdown ? "-rotate-90" : "rotate-90"
                }`}
              />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-1.5 right-0 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden min-w-35">
                {["all", "unread", "read", "replied"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setShowStatusDropdown(false);
                      setPage(1);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      statusFilter === s
                        ? "font-semibold text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {s === "all" ? "All" : STATUS_CONFIG[s]?.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Range filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRangeDropdown(!showRangeDropdown);
                setShowStatusDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-400 transition-colors"
            >
              Range: {rangeLabel}
              <ChevronLeft
                size={13}
                className={`transition-transform ${
                  showRangeDropdown ? "-rotate-90" : "rotate-90"
                }`}
              />
            </button>
            {showRangeDropdown && (
              <div className="absolute top-full mt-1.5 right-0 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden min-w-37.5">
                {DATE_RANGES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => {
                      setRangeFilter(r.value);
                      setShowRangeDropdown(false);
                      setPage(1);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      rangeFilter === r.value
                        ? "font-semibold text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter icon */}
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
            <Filter size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_3fr_1.8fr_1fr] px-6 py-3 border-b border-gray-100">
            {["Sender", "Inquiry Details", "Date Received", "Status"].map(
              (h) => (
                <span
                  key={h}
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                >
                  {h}
                </span>
              )
            )}
          </div>

          {/* Rows */}
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_3fr_1.8fr_1fr] px-6 py-5 border-b border-gray-50 gap-4"
              >
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3.5 w-32 self-center" />
                <Skeleton className="h-6 w-20 rounded-full self-center" />
              </div>
            ))
          ) : paginated.length === 0 ? (
            <div className="py-20 text-center">
              <Mail size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No inquiries found</p>
            </div>
          ) : (
            paginated.map((c) => (
              <div
                key={c._id}
                className={`grid grid-cols-[2fr_3fr_1.8fr_1fr] px-6 py-4 border-b border-gray-50 hover:bg-gray-50/70 transition-colors cursor-pointer group ${
                  c.status === "unread" ? "bg-red-50/20" : ""
                }`}
                onClick={() => handleView(c)}
              >
                {/* Sender */}
                <div className="flex items-center gap-3 pr-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        c.status === "unread" ? "font-bold" : "font-medium"
                      } text-gray-900`}
                    >
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-35">
                      {c.email}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="pr-4">
                  <p
                    className={`text-sm ${
                      c.status === "unread" ? "font-semibold" : "font-medium"
                    } text-gray-800`}
                  >
                    {c.topic}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-65 mt-0.5">
                    "{c.message}"
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center">
                  <p className="text-xs text-gray-500">
                    {formatDate(c.createdAt)}
                  </p>
                </div>

                {/* Status + actions */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={c.status} />
                  <div
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity ml-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleReply(c._id)}
                      title="Reply"
                      className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Send size={12} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      title="Delete"
                      className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-xs text-gray-400">
              Showing{" "}
              {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} inquiries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} className="text-gray-600" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let num;
                if (totalPages <= 5) num = i + 1;
                else if (page <= 3) num = i + 1;
                else if (page >= totalPages - 2) num = totalPages - 4 + i;
                else num = page - 2 + i;
                return num;
              }).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors ${
                    page === num
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {num}
                </button>
              ))}

              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className="text-xs text-gray-400 px-1">...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-8 h-8 text-xs rounded-lg font-medium hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <DetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onDelete={handleDelete}
          onReply={handleReply}
        />
      )}

      {/* Close dropdowns on outside click */}
      {(showStatusDropdown || showRangeDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowStatusDropdown(false);
            setShowRangeDropdown(false);
          }}
        />
      )}
    </div>
  );
}