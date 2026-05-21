"use client";

import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Send, Image as ImageIcon, AlertCircle, RefreshCw, ArrowLeft,
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchContact, sendReply } from "@/api/(public)/submitContact";

// ─── Toolbar Button ───────────────────────────────────────────────
function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Tiptap Editor ────────────────────────────────────────────────
const TiptapTextBlock = forwardRef(function TiptapTextBlock(
  { value, onChange, placeholder = "Write your reply here..." },
  ref
) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useImperativeHandle(ref, () => ({
    clear: () => editor?.commands.clearContent(true),
    setContent: (html) => editor?.commands.setContent(html),
  }));

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-gray-900/10 focus-within:border-gray-400 transition-all">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50 flex-wrap">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><UnderlineIcon size={14} /></ToolbarButton>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List"><List size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List"><ListOrdered size={14} /></ToolbarButton>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left"><AlignLeft size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center"><AlignCenter size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right"><AlignRight size={14} /></ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-3 py-2.5 min-h-50 text-sm text-gray-700 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-300 [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  );
});

// ─── Reply Page ───────────────────────────────────────────────────
export default function ReplyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [reply, setReply] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationError, setValidationError] = useState("");

  const editorRef = useRef(null);

  // ─── Fetch contact ──────────────────────────────────────────────
  const {
    data: contact,
    isLoading: fetchLoading,
    isError: fetchError,
  } = useQuery({
    queryKey: ["contact", id],
    queryFn: () => fetchContact(id),
    enabled: !!id,
    retry: 1,
  });

  // ─── Send reply mutation ────────────────────────────────────────
  const { mutate: submitReply, isPending: sending, error: mutationError } = useMutation({
    mutationFn: sendReply,
    onSuccess: () => router.push("/admin/inquiries"),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSend = () => {
    const isEmpty = !reply || reply === "<p></p>" || reply.trim() === "";
    if (isEmpty) return setValidationError("Reply content cannot be empty.");
    setValidationError("");
    submitReply({ id, reply, imageFile });
  };

  const error = validationError || mutationError?.message;

  // ─── Loading ────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8f7] flex items-center justify-center">
        <RefreshCw size={20} className="animate-spin text-gray-400" />
      </div>
    );
  }

  // ─── Error / not found ──────────────────────────────────────────
  if (fetchError || !contact) {
    return (
      <div className="min-h-screen bg-[#f8f8f7] flex flex-col items-center justify-center gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm text-gray-500">Inquiry not found.</p>
        <button onClick={() => router.push("/admin/inquiries")} className="text-sm text-gray-700 underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f7] font-sans">
      <div className="max-w-3xl mx-auto px-6 py-8">

        <button
          onClick={() => router.push("/admin/inquiries")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft size={15} /> Back to Inquiries
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Reply</h1>
          <p className="text-sm text-gray-400 mt-1">
            Responding to inquiry from{" "}
            <span className="font-medium text-gray-600">{contact.name}</span>
          </p>
        </div>

        {/* Original inquiry card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Original Inquiry</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[["Name", contact.name], ["Email", contact.email], ["Topic", contact.topic], ["Phone", contact.phone]].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-medium text-gray-800">{val}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Message</p>
            <p className="text-sm text-gray-700 leading-relaxed">{contact.message}</p>
          </div>
          {contact.reply && (
            <div className="mt-4 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-2">Previous Reply</p>
              <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contact.reply }} />
              {contact.replyImageUrl && (
                <img src={contact.replyImageUrl} alt="Reply attachment" className="mt-3 rounded-xl max-h-48 object-cover" />
              )}
            </div>
          )}
        </div>

        {/* Reply editor card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            {contact.reply ? "Write New Reply" : "Write Reply"}
          </p>

          <TiptapTextBlock
            ref={editorRef}
            value={reply}
            onChange={(html) => { setReply(html); if (validationError) setValidationError(""); }}
            placeholder="Write your reply here..."
          />

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer w-fit group">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-200 group-hover:border-gray-400 transition-colors">
                <ImageIcon size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                  {imageFile ? imageFile.name : "Attach image (optional)"}
                </span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-3 rounded-xl max-h-40 object-cover border border-gray-100" />
            )}
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
              <AlertCircle size={12} /> {error}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
            <button onClick={() => router.push("/admin/inquiries")} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {sending ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}