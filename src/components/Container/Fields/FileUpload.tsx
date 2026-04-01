import { useState, useEffect } from "react";

type Props = {
  label: string;
  type: "image" | "video";
  value: File | null;
  setValue: (file: File | null) => void;
  previewUrl?: string | null;
};

const FileUpload = ({
  label,
  type,
  value,
  setValue,
  previewUrl = null,
}: Props) => {
  const BASE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (previewUrl) {
      setPreview(`${BASE_URL}${previewUrl}`);
    } else {
      setPreview(null);
    }
  }, [value, previewUrl]);
  console.log(preview);

  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <label className="flex flex-col items-center justify-center w-full mt-2 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
        <span className="text-gray-500 text-sm">
          {value
            ? value.name
            : preview
              ? `${label} already uploaded`
              : `Click to upload ${label.toLowerCase()}`}
        </span>
        <input
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setValue(file);
          }}
        />
      </label>
      {preview && (
        <div className="flex justify-center mt-2">
          {type === "image" ? (
            <img
              src={preview}
              alt="preview"
              className="h-20 w-28 rounded-md object-cover"
            />
          ) : (
            <video src={preview} controls className="h-24 rounded-md" />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
