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
}: Props) => {
  const BASE_URL = import.meta.env.VITE_BASE_IMAGE_URL;
  const [preview, setPreview] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        const urls = value.map((file) => URL.createObjectURL(file));
        setPreview(urls);
        setFileNames(value.map((f) => f.name));
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
      } else {
        const url = URL.createObjectURL(value);
        setPreview([url]);
        setFileNames([value.name]);
        return () => URL.revokeObjectURL(url);
      }
    } else if (previewUrl) {
      if (Array.isArray(previewUrl)) {
        setPreview(previewUrl.map((p) => `${BASE_URL}${p}`));
      } else {
        setPreview([`${BASE_URL}${previewUrl}`]);
      }
      setFileNames([]);
    } else {
      setPreview([]);
      setFileNames([]);
    }
  }, [value, previewUrl]);

  const processFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const sizeMB = file.size / (1024 * 1024);
      return sizeMB <= maxSizeMB;
    });

    if (multiple) {
      setValue(validFiles);
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
    if (multiple && Array.isArray(value)) {
      const updated = value.filter((_, i) => i !== index);
      setValue(updated);
    } else {
      setValue(null);
    }
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
            <div key={i} className="relative border border-gray-300 rounded p-1 bg-white">
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

              <p className="text-xs mt-1 text-center truncate w-24">
                {fileNames[i] || "Uploaded"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
