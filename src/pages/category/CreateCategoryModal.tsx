import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, updateCategory } from "../../store/slice/categorySlice";

const CreateCategoryModal = ({ onClose, data }: any) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(
    (state: any) => state.category
  );

  const isEdit = !!data;
  const [form, setForm] = useState({
    name: "",
    description: "",
    isTopCategory: false,
  });

  const [image, setImage] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        description: data.description || "",
        isTopCategory: data.isTopCategory || false,
      });
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!form.name) {
      alert("Name is required");
      return;
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("isTopCategory", String(form.isTopCategory));
    if (image) formData.append("categoryImage", image);
    if (video) formData.append("categoryVideo", video);

    try {

      if (isEdit) {
        await dispatch(updateCategory({ slug: data.slug, formData }) as any).unwrap();
      } else {
        await dispatch(createCategory(formData) as any).unwrap();
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-9999">
      <div className="bg-white p-6 rounded-xl w-[422px] space-y-4 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Update Category" : "Create Category"}
        </h2>
        <input
          placeholder="Category Name"
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          placeholder="Description"
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        <div>
          <label className="text-sm text-gray-600">Image</label>
          <input
            type="file"
            className="w-full mt-1"
            onChange={(e) => setImage(e.target.files?.[0])}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Video</label>
          <input
            type="file"
            className="w-full mt-1"
            onChange={(e) => setVideo(e.target.files?.[0])}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {loading
              ? isEdit ? "Updating..." : "Creating..."
              : isEdit ? "Update" : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateCategoryModal;