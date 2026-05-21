"use client";
import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/api/(public)/upload";

const ImageUpload = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const data = await uploadImage(file);
      onChange({ url: data.url, publicId: data.publicId, altText: "" });
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setError("");
  };

  return (
    <div className="space-y-2">
      {value?.url ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={value.url}
            alt={value.altText || "Featured image"}
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            uploading
              ? "border-gray-200 bg-gray-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <ImageIcon size={24} />
                <span className="text-xs">
                  Drag and drop or{" "}
                  <span className="text-blue-500 underline">browse</span>
                </span>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;