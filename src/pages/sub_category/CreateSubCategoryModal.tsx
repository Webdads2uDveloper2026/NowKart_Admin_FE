import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/slice/categorySlice";
import SingleSelectDropdown from "../../components/Container/Fields/SingleSelectDropdown";
import {
  createSubcategory,
  updateSubcategory,
} from "../../store/slice/subcategorySlice";
import Button from "../../components/Container/Button/Button";

const CreateSubCategoryModal = ({ onClose, data }: any) => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(
    (state: any) => state.category || {},
  );
  const isEdit = !!data;
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [form, setForm] = useState({
    subCategory: "",
    description: "",
  });

  useEffect(() => {
    dispatch(getCategories() as any);
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setForm({
        subCategory: data?.name || "",
        description: data?.description || "",
      });
      setSelectedCategory(data?.category?._id || "");
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!form.subCategory) {
      alert("Name is required");
      return;
    }
    const payload: any = {
      subCategory: form.subCategory,
      description: form.description,
    };
    if (selectedCategory) {
      payload.category = selectedCategory;
    }
    if (isEdit) {
      await dispatch(updateSubcategory({ slug: data?.slug, payload }) as any);
    } else {
      await dispatch(createSubcategory(payload) as any);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-9999">
      <div className="bg-white p-6 rounded-xl w-[460px] space-y-5 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Update Category" : "Create Category"}
        </h2>
        <SingleSelectDropdown
          label="Parent Category"
          options={categories || []}
          value={selectedCategory}
          onChange={(val) => setSelectedCategory(val)}
          searchable={true}
          labelKey="name"
          placeholder="Select Category"
        />
        <div>
          <label className="block text-sm  text-gray-600 mb-1">
            Category Name
          </label>
          <input
            placeholder="Enter category name"
            className="border border-gray-300 p-3 w-full rounded-xl focus:outline-none "
            value={form.subCategory}
            onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm  text-gray-600 mb-1">
            Description
          </label>
          <input
            placeholder="Enter description"
            className="border border-gray-300 p-3 w-full rounded-xl  focus:outline-none "
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
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

export default CreateSubCategoryModal;
