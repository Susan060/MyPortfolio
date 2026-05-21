"use client";
import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { uploadImage } from "@/api/(public)/upload";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Minus,
  Heading2,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Grid3x3,
  Image as ImageIcon,
  Palette,
  PlusSquare,
  Trash2,
  Undo,
  Redo,
  ExternalLink,
  Pencil,
  X,
} from "lucide-react";

// ─── Helper Components ───────────────────────────────────────
const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1" />;

const ToolbarButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => e.preventDefault()}
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`p-1.5 rounded text-sm transition-colors ${active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
  >
    {children}
  </button>
);

const BubbleButton = ({ onClick, active, children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`p-1.5 rounded transition-all select-none ${active ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"
      }`}
  >
    {children}
  </button>
);

const AlignMenuButton = ({ onClick, active, icon, label }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded w-full text-left transition ${active ? "bg-blue-600 text-white" : "text-gray-700"
      }`}
  >
    {icon} {label}
  </button>
);

const TableMenuBtn = ({ onClick, label, icon, className = "" }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded text-left transition ${className}`}
  >
    {icon} {label}
  </button>
);

// ─── Main Component ───────────────────────────────────────────
const TiptapEditor = ({ value, onChange }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // ─── NEW: Link preview popup state
  const [linkPreview, setLinkPreview] = useState(null); // { href, top, left }
  const [isEditingLinkPreview, setIsEditingLinkPreview] = useState(false);
  const [linkPreviewEditUrl, setLinkPreviewEditUrl] = useState("");
  const linkPreviewRef = useRef(null);

  // Bubble menu
  const [showBubbleMenu, setShowBubbleMenu] = useState(false);
  const [bubbleMenuPos, setBubbleMenuPos] = useState({ top: 0, left: 0 });
  const [showBubbleLinkInput, setShowBubbleLinkInput] = useState(false);
  const [bubbleLinkUrl, setBubbleLinkUrl] = useState("");
  const [showBubbleHeadingMenu, setShowBubbleHeadingMenu] = useState(false);
  const [showBubbleAltInput, setShowBubbleAltInput] = useState(false);
  const [bubbleAltText, setBubbleAltText] = useState("");

  const fileInputRef = useRef(null);

  const DEFAULT_COLOR = "#374151";

  const presetColors = [
    "#ffffff", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff00ff", "#00ffff", "#fbbf24",
    "#60a5fa", "#f87171",
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        code: true,
        codeBlock: true,
        blockquote: true,
        horizontalRule: false,
      }),
      TextStyle,
      Color,
      Underline,
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-500 underline" },
      }),
      Placeholder.configure({
        placeholder: "Start writing your blog content...",
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto my-4" },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      if (isInitialized) {
        onChange(editor.getHTML());
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const { view } = editor;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);
        setBubbleMenuPos({
          top: start.top - 50,
          left: (start.left + end.left) / 2,
        });
        setShowBubbleMenu(true);
      } else {
        setShowBubbleMenu(false);
        setShowBubbleLinkInput(false);
        setShowBubbleHeadingMenu(false);
        setShowBubbleAltInput(false);
      }
    },
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[350px] outline-none p-4 bg-white text-gray-800 leading-relaxed tiptap-editor",
      },
      // ─── NEW: detect clicks on <a> tags inside the editor
      handleClick(view, pos, event) {
        const target = event.target;
        if (target.tagName === "A" || target.closest("a")) {
          const anchor = target.tagName === "A" ? target : target.closest("a");
          const href = anchor.getAttribute("href");
          if (href) {
            const rect = anchor.getBoundingClientRect();
            setLinkPreview({
              href,
              top: rect.bottom + window.scrollY + 6,
              left: rect.left + window.scrollX,
            });
            setIsEditingLinkPreview(false);
            setLinkPreviewEditUrl(href);
            return true; // prevent default link navigation
          }
        }
        // Clicked elsewhere — close preview
        setLinkPreview(null);
        setIsEditingLinkPreview(false);
        return false;
      },
    },
  });

  // Load initial value
  useEffect(() => {
    if (editor && !isInitialized) {
      editor.commands.setContent(value || "");
      setIsInitialized(true);
    }
  }, [editor, value, isInitialized]);

  // ─── NEW: Close link preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (linkPreviewRef.current && !linkPreviewRef.current.contains(e.target)) {
        setLinkPreview(null);
        setIsEditingLinkPreview(false);
      }
    };
    if (linkPreview) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [linkPreview]);

  // ─── NEW: Apply edited link from preview popup
  const handleLinkPreviewEdit = () => {
    if (!linkPreviewEditUrl) return;
    // Select the link node and update its href
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkPreviewEditUrl }).run();
    setLinkPreview({ ...linkPreview, href: linkPreviewEditUrl });
    setIsEditingLinkPreview(false);
  };

  // ─── NEW: Remove link from preview popup
  const handleLinkPreviewRemove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkPreview(null);
    setIsEditingLinkPreview(false);
  };

  // ─── Link handlers
  const handleSetLink = () => {
    if (!linkUrl) return;
    editor.chain().focus().unsetColor().setLink({ href: linkUrl }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  };

  const handleSetBubbleLink = () => {
    if (!bubbleLinkUrl) return;
    editor.chain().focus().unsetColor().setLink({ href: bubbleLinkUrl }).run();
    setBubbleLinkUrl("");
    setShowBubbleLinkInput(false);
  };

  const handleSetBubbleAlt = () => {
    if (editor.isActive("image")) {
      editor.chain().focus().updateAttributes("image", { alt: bubbleAltText }).run();
    }
    setShowBubbleAltInput(false);
  };

  // ─── Image upload
  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadImage(file);
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        editor.chain().focus().setImage({ src: e.target.result, alt: file.name }).run();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // ─── Bubble menu toggles
  const toggleBubbleHeading = () => {
    setShowBubbleHeadingMenu((p) => !p);
    setShowBubbleLinkInput(false);
    setShowBubbleAltInput(false);
  };

  const toggleBubbleLink = () => {
    setShowBubbleLinkInput((p) => !p);
    setShowBubbleHeadingMenu(false);
    setShowBubbleAltInput(false);
  };

  const toggleBubbleAlt = () => {
    if (!showBubbleAltInput) {
      setBubbleAltText(editor.getAttributes("image").alt || "");
    }
    setShowBubbleAltInput((p) => !p);
    setShowBubbleLinkInput(false);
    setShowBubbleHeadingMenu(false);
  };

  if (!editor) return null;

  const activeColor = editor.getAttributes("textStyle").color;
  const normalizedColor =
    typeof activeColor === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(activeColor)
      ? activeColor
      : DEFAULT_COLOR;

  const activeBubbleHeadingLevel = [1, 2, 3, 4, 5, 6].find((l) =>
    editor.isActive("heading", { level: l })
  );

  // Truncate long URLs for display
  const truncateUrl = (url, maxLen = 40) =>
    url.length > maxLen ? url.slice(0, maxLen) + "…" : url;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <style jsx global>{`
        .tiptap-editor h1 { font-size: 2.25rem; color: #1a202c; font-weight: 800; margin: 1rem 0; }
        .tiptap-editor h2 { font-size: 1.85rem; color: #1a202c; font-weight: 700; margin: 0.875rem 0; }
        .tiptap-editor h3 { font-size: 1.5rem; color: #1a202c; font-weight: 600; margin: 0.75rem 0; }
        .tiptap-editor h4 { font-size: 1.25rem; color: #1a202c; font-weight: 600; margin: 0.625rem 0; }
        .tiptap-editor h5 { font-size: 1.1rem; color: #1a202c; font-weight: 600; margin: 0.5rem 0; }
        .tiptap-editor h6 { font-size: 1rem; color: #1a202c; font-weight: 600; margin: 0.5rem 0; }
        .tiptap-editor p { margin: 0.75rem 0; }
        .tiptap-editor ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
        .tiptap-editor ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
        .tiptap-editor li { margin: 0.25rem 0; }
        .tiptap-editor strong { font-weight: 700; color: #1a202c; }
        .tiptap-editor blockquote {
          border-left: 4px solid #ef4444;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4a5568;
          display: block !important;
        }
        .tiptap-editor table { border-collapse: collapse; width: auto; max-width: 100%; margin: 1rem 0; }
        .tiptap-editor th, .tiptap-editor td { border: 1px solid #e2e8f0; padding: 0.5rem; }
        .tiptap-editor th { background-color: #f7fafc; font-weight: 600; }
        .tiptap-editor hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.5rem 0; }
        .tiptap-editor a { color: #3b82f6; text-decoration: underline; cursor: pointer; }
        .tiptap-editor code { background: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.875rem; }
        .tiptap-editor pre { background: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
        .tiptap-editor img { max-width: 100%; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .tiptap-editor img.ProseMirror-selectednode { outline: 3px solid #60a5fa; }
        .tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #9ca3af; pointer-events: none; height: 0; }
      `}</style>

      <div className="border border-gray-200 rounded-lg overflow-hidden relative">
        {/* ─── Toolbar ─── */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 p-2 bg-gray-50">

          {/* Heading Dropdown */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowHeadingMenu((p) => !p)}
              className="p-1.5 rounded flex items-center gap-1 hover:bg-gray-100 text-gray-600 transition text-sm"
            >
              <Heading2 size={15} />
              <ChevronDown size={10} />
            </button>
            {showHeadingMenu && (
              <div className="absolute z-50 top-9 left-0 bg-white border border-gray-200 shadow-xl rounded-lg p-1 min-w-35">
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().toggleHeading({ level }).run();
                      setShowHeadingMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm hover:bg-gray-100 ${editor.isActive("heading", { level })
                      ? "bg-gray-900 text-white"
                      : "text-gray-700"
                      }`}
                  >
                    Heading {level}
                  </button>
                ))}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().setParagraph().run();
                    setShowHeadingMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-sm hover:bg-gray-100 ${editor.isActive("paragraph") ? "bg-gray-900 text-white" : "text-gray-700"
                    }`}
                >
                  Normal Text
                </button>
              </div>
            )}
          </div>

          <Divider />

          {/* Color Picker */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowColorMenu((p) => !p)}
              className="p-1.5 rounded flex items-center gap-1 hover:bg-gray-100 text-gray-600 transition relative"
            >
              <Palette size={15} />
              <div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded"
                style={{ backgroundColor: normalizedColor }}
              />
            </button>
            {showColorMenu && (
              <div className="absolute z-50 top-9 left-0 bg-white border border-gray-200 shadow-xl rounded-lg p-3 grid grid-cols-5 gap-2 min-w-45">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorMenu(false);
                    }}
                    className={`w-6 h-6 rounded-full border-2 ${normalizedColor.toLowerCase() === color.toLowerCase()
                      ? "border-gray-900"
                      : "border-gray-200"
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  className="w-full col-span-5 h-8 cursor-pointer"
                  value={normalizedColor}
                  onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorMenu(false);
                  }}
                  className="col-span-5 text-xs text-gray-400 hover:text-gray-700 mt-1"
                >
                  Reset Color
                </button>
              </div>
            )}
          </div>

          <Divider />

          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <span className="text-sm font-bold underline">U</span>
          </ToolbarButton>

          <Divider />

          {/* Link */}
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowLinkInput((p) => !p)}
              active={editor.isActive("link")}
              title="Add Link"
            >
              <LinkIcon size={15} />
            </ToolbarButton>
            {showLinkInput && (
              <div className="absolute z-50 top-9 left-0 bg-white border border-gray-200 shadow-xl rounded-lg p-3 min-w-65">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSetLink()}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm mb-2 outline-none focus:border-gray-400"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleSetLink}
                    className="flex-1 bg-gray-900 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700 transition"
                  >
                    Set Link
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setShowLinkInput(false);
                    }}
                    className="px-2 py-1.5 border border-gray-200 rounded text-sm text-gray-500 hover:bg-gray-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Ordered List"
          >
            <ListOrdered size={15} />
          </ToolbarButton>

          <Divider />

          {/* Alignment */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowAlignMenu((p) => !p)}
              className="p-1.5 rounded flex items-center gap-1 hover:bg-gray-100 text-gray-600 transition text-sm"
            >
              <AlignLeft size={15} />
              <ChevronDown size={10} />
            </button>
            {showAlignMenu && (
              <div className="absolute z-50 top-9 left-0 bg-white border border-gray-200 shadow-xl rounded-lg p-1 min-w-35">
                <AlignMenuButton
                  onClick={() => { editor.chain().focus().setTextAlign("left").run(); setShowAlignMenu(false); }}
                  active={editor.isActive({ textAlign: "left" })}
                  icon={<AlignLeft size={14} />}
                  label="Left"
                />
                <AlignMenuButton
                  onClick={() => { editor.chain().focus().setTextAlign("center").run(); setShowAlignMenu(false); }}
                  active={editor.isActive({ textAlign: "center" })}
                  icon={<AlignCenter size={14} />}
                  label="Center"
                />
                <AlignMenuButton
                  onClick={() => { editor.chain().focus().setTextAlign("right").run(); setShowAlignMenu(false); }}
                  active={editor.isActive({ textAlign: "right" })}
                  icon={<AlignRight size={14} />}
                  label="Right"
                />
              </div>
            )}
          </div>

          <Divider />

          {/* Blockquote + HR + Code */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <Code size={15} />
          </ToolbarButton>

          <Divider />

          {/* Table */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowTableMenu((p) => !p)}
              className={`p-1.5 rounded flex items-center gap-1 transition text-sm ${editor.isActive("table")
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-100 text-gray-600"
                }`}
            >
              <Grid3x3 size={15} />
              <ChevronDown size={10} />
            </button>
            {showTableMenu && (
              <div className="absolute z-50 top-9 left-0 bg-white border border-gray-200 shadow-xl rounded-lg p-1 min-w-47.5">
                <TableMenuBtn
                  onClick={() => {
                    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                    setShowTableMenu(false);
                  }}
                  icon={<PlusSquare size={13} />}
                  label="Insert 3x3 Table"
                />
                <div className="border-t border-gray-100 my-1" />
                <TableMenuBtn onClick={() => editor.chain().focus().addColumnAfter().run()} label="Add Column After" />
                <TableMenuBtn onClick={() => editor.chain().focus().addRowAfter().run()} label="Add Row After" />
                <TableMenuBtn onClick={() => editor.chain().focus().deleteColumn().run()} label="Delete Column" className="text-red-400" />
                <TableMenuBtn onClick={() => editor.chain().focus().deleteRow().run()} label="Delete Row" className="text-red-400" />
                <TableMenuBtn
                  onClick={() => { editor.chain().focus().deleteTable().run(); setShowTableMenu(false); }}
                  icon={<Trash2 size={13} />}
                  label="Delete Table"
                  className="text-red-500 font-semibold"
                />
              </div>
            )}
          </div>

          <Divider />

          {/* Image Upload */}
          <ToolbarButton onClick={handleImageClick} title="Upload Image">
            <ImageIcon size={15} />
          </ToolbarButton>

          <Divider />

          {/* Undo / Redo */}
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo size={15} />
          </ToolbarButton>
        </div>

        {/* ─── Bubble Menu ─── */}
        {showBubbleMenu && (
          <div
            className="fixed bg-white border border-gray-200 rounded-lg shadow-xl p-1 flex items-center gap-1 z-9999 select-none"
            style={{
              top: `${bubbleMenuPos.top}px`,
              left: `${bubbleMenuPos.left}px`,
              transform: "translateX(-50%)",
              isolation: "isolate",
            }}
            onMouseDown={(e) => {
              if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                e.preventDefault();
              }
            }}
          >
            {/* Heading dropdown */}
            <div className="relative">
              <BubbleButton
                onClick={toggleBubbleHeading}
                active={!!activeBubbleHeadingLevel}
              >
                <span className="flex items-center gap-1 text-xs font-semibold">
                  {activeBubbleHeadingLevel ? `H${activeBubbleHeadingLevel}` : "Normal"}
                  <ChevronDown size={9} />
                </span>
              </BubbleButton>
              {showBubbleHeadingMenu && (
                <div className="absolute bottom-10 left-0 bg-white border border-gray-200 shadow-xl rounded-lg p-1 min-w-32.5 z-50">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        editor.chain().focus().toggleHeading({ level }).run();
                        setShowBubbleHeadingMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs hover:bg-gray-100 ${editor.isActive("heading", { level }) ? "bg-gray-900 text-white" : "text-gray-700"
                        }`}
                    >
                      H{level}
                    </button>
                  ))}
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { editor.chain().focus().setParagraph().run(); setShowBubbleHeadingMenu(false); }}
                    className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-gray-100 text-gray-700"
                  >
                    Normal
                  </button>
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-gray-200" />

            <BubbleButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
            >
              <Bold size={13} />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
            >
              <Italic size={13} />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
            >
              <span className="text-xs font-bold underline">U</span>
            </BubbleButton>

            <div className="w-px h-4 bg-gray-200" />

            {/* Bubble Link */}
            <div className="relative">
              <BubbleButton onClick={toggleBubbleLink} active={editor.isActive("link")}>
                <LinkIcon size={13} />
              </BubbleButton>
              {showBubbleLinkInput && (
                <div className="absolute bottom-10 left-0 bg-white border border-gray-200 shadow-xl rounded-lg p-3 min-w-60 z-50">
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={bubbleLinkUrl}
                    onChange={(e) => setBubbleLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSetBubbleLink()}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm mb-2 outline-none"
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleSetBubbleLink}
                    className="w-full bg-gray-900 text-white px-2 py-1 rounded text-xs"
                  >
                    Set Link
                  </button>
                </div>
              )}
            </div>

            {/* Bubble Alt Text (images only) */}
            {editor.isActive("image") && (
              <>
                <div className="w-px h-4 bg-gray-200" />
                <div className="relative">
                  <BubbleButton onClick={toggleBubbleAlt}>
                    <span className="text-[10px] font-bold">ALT</span>
                  </BubbleButton>
                  {showBubbleAltInput && (
                    <div className="absolute bottom-10 left-0 bg-white border border-gray-200 shadow-xl rounded-lg p-3 min-w-60 z-50">
                      <input
                        type="text"
                        placeholder="Describe the image..."
                        value={bubbleAltText}
                        onChange={(e) => setBubbleAltText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSetBubbleAlt()}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm mb-2 outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleSetBubbleAlt}
                        className="w-full bg-gray-900 text-white px-2 py-1 rounded text-xs"
                      >
                        Update Alt Text
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── Editor Content ─── */}
        <EditorContent editor={editor} />
      </div>

      {/* ─── NEW: Link Preview Popup ─── */}
      {linkPreview && (
        <div
          ref={linkPreviewRef}
          className="fixed z-10000 bg-white border border-gray-200 rounded-lg shadow-xl"
          style={{
            top: `${linkPreview.top}px`,
            left: `${linkPreview.left}px`,
          }}
          onMouseDown={(e) => {
            if (e.target.tagName !== "INPUT") e.preventDefault();
          }}
        >
          {!isEditingLinkPreview ? (
            /* ── View mode: Visit URL | Edit | Remove ── */
            <div className="flex items-center gap-0 text-sm">
              {/* Visit URL */}
              <a
                href={linkPreview.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-l-lg transition-colors"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <ExternalLink size={13} className="text-gray-400 shrink-0" />
                <span className="text-blue-500 underline underline-offset-2 max-w-55 truncate">
                  {truncateUrl(linkPreview.href)}
                </span>
              </a>

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200 shrink-0" />

              {/* Edit */}
              <button
                type="button"
                onClick={() => {
                  setLinkPreviewEditUrl(linkPreview.href);
                  setIsEditingLinkPreview(true);
                }}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                <Pencil size={12} />
                Edit
              </button>

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200 shrink-0" />

              {/* Remove */}
              <button
                type="button"
                onClick={handleLinkPreviewRemove}
                className="flex items-center gap-1 px-3 py-2 text-red-500 hover:bg-red-50 rounded-r-lg transition-colors font-medium"
              >
                <X size={12} />
                Remove
              </button>
            </div>
          ) : (
            /* ── Edit mode: inline URL input ── */
            <div className="flex items-center gap-2 px-3 py-2 min-w-72">
              <LinkIcon size={13} className="text-gray-400 shrink-0" />
              <input
                type="url"
                autoFocus
                value={linkPreviewEditUrl}
                onChange={(e) => setLinkPreviewEditUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLinkPreviewEdit();
                  if (e.key === "Escape") setIsEditingLinkPreview(false);
                }}
                className="flex-1 text-sm outline-none text-gray-800 bg-transparent"
                placeholder="https://example.com"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleLinkPreviewEdit}
                className="text-xs bg-gray-900 text-white px-2.5 py-1 rounded hover:bg-gray-700 transition shrink-0"
              >
                Save
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setIsEditingLinkPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition shrink-0"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TiptapEditor;