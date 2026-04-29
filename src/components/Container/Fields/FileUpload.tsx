import { useState, useEffect } from "react";

type Props = {
  label: string;
  type: "image" | "video";
  value: File | File[] | null;
  setValue: (file: File | File[] | null) => void;
  previewUrl?: string | string[] | null;
  height?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  deletedFiles?: string[];
  setDeletedFiles?: (files: string[]) => void;
};

const FileUpload = ({
  label,
  type,
  value,
  setValue,
  height = "h-24",
  previewUrl = null,
  multiple = false,
  maxSizeMB = 2,
  deletedFiles = [],
  setDeletedFiles,
}: Props) => {
  const BASE_URL = import.meta.env.VITE_BASE_IMAGE_URL;
  const [preview, setPreview] = useState<string[]>([]);

  useEffect(() => {
    let urls: string[] = [];

    if (previewUrl) {
      if (Array.isArray(previewUrl)) {
        urls = previewUrl.map((p) => `${BASE_URL}${p}`);
      } else {
        urls = [`${BASE_URL}${previewUrl}`];
      }
    }

    if (value) {
      const files = Array.isArray(value) ? value : [value];
      const validFiles = files.filter((f) => f instanceof File);
      const fileUrls = validFiles.map((file) => URL.createObjectURL(file));

      urls = [...urls, ...fileUrls];
      setPreview(urls);

      return () => fileUrls.forEach((url) => URL.revokeObjectURL(url));
    }

    setPreview(urls);
  }, [value, previewUrl]);

  const processFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const sizeMB = file.size / (1024 * 1024);
      return sizeMB <= maxSizeMB;
    });

    if (multiple) {
      if (Array.isArray(value)) {
        setValue([...value, ...validFiles]);
      } else {
        setValue(validFiles);
      }
    } else {
      setValue(validFiles[0] || null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const removeFile = (index: number) => {
    const serverImages = Array.isArray(previewUrl)
      ? previewUrl
      : previewUrl
        ? [previewUrl]
        : [];

    const isServerImage = index < serverImages.length;

    if (isServerImage) {
      const removedImage = serverImages[index];
      if (setDeletedFiles) {
        setDeletedFiles([...deletedFiles, removedImage]);
      }
      setPreview((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (!Array.isArray(value)) return;

    const fileIndex = index - serverImages.length;
    const updated = value.filter((_, i) => i !== fileIndex);
    setValue(updated);
  };

  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`flex flex-col items-center justify-center w-full mt-2 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-orange-500 transition ${height}`}
      >
        <span className="text-gray-500 text-sm text-center px-2">
          Drag & drop or click to upload <br />
          (Max {maxSizeMB}MB)
        </span>

        <input
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          className="hidden"
          multiple={multiple}
          onChange={handleChange}
        />
      </label>

      {preview.length > 0 && (
        <div className="flex gap-3 mt-3 flex-wrap">
          {preview.map((src, i) => (
            <div
              key={i}
              className="relative border border-gray-300 rounded p-1 bg-white"
            >
              {type === "image" ? (
                <img src={src} className="h-15 w-24 object-cover rounded" />
              ) : (
                <video src={src} className="h-20 rounded" controls />
              )}

              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-2 -right-2 cursor-pointer bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
