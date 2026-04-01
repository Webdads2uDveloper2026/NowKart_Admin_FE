import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  updateCategory,
} from "../../store/slice/categorySlice";
import Button from "../../components/Container/Button/Button";
import FileUpload from "../../components/Container/Fields/FileUpload";

const CreateCategoryModal = ({ onClose, data }: any) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.category);
  const [image, setImage] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);

  const isEdit = !!data;
  const [form, setForm] = useState({
    name: "",
    description: "",
    isTopCategory: false,
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data?.name || "",
        description: data?.description || "",
        isTopCategory: data?.isTopCategory || false,
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
        await dispatch(
          updateCategory({ slug: data.slug, formData }) as any,
        ).unwrap();
      } else {
        await dispatch(createCategory(formData) as any).unwrap();
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-9999"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl w-[422px] space-y-4 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Update Category" : "Create Category"}
        </h2>
        <input
          placeholder="Category Name"
          className="border p-3 w-full rounded-lg focus:outline-none border-gray-300 hover:border-orange-500"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Description"
          className="border p-3 w-full rounded-lg focus:outline-none border-gray-300 hover:border-orange-500"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <FileUpload
          label="Image"
          type="image"
          value={image}
          setValue={setImage}
          previewUrl={data?.image}
        />

        <FileUpload
          label="Video"
          type="video"
          value={video}
          setValue={setVideo}
          previewUrl={data?.video}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
