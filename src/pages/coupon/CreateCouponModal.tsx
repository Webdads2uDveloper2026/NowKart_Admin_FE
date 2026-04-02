import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon, updateCoupon } from "../../store/slice/couponSlice";
import Button from "../../components/Container/Button/Button";

const CreateCouponModal = ({ onClose, data }: any) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.coupon || {});
  const isEdit = !!data;

  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "PERCENTAGE",
    value: "",
    minPurchaseAmount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        code: data?.code || "",
        description: data?.description || "",
        type: data?.type || "PERCENTAGE",
        value: data?.value || "",
        minPurchaseAmount: data?.minPurchaseAmount || "",
        startDate: data?.startDate?.slice(0, 16) || "",
        endDate: data?.endDate?.slice(0, 16) || "",
      });
    }
  }, [data]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.code || !form.value) {
      alert("Code & Value are required");
      return;
    }

    const payload = {
      ...form,
      value: Number(form.value),
      minPurchaseAmount: Number(form.minPurchaseAmount),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };

    if (isEdit) {
      await dispatch(updateCoupon({ id: data?._id, data: payload }) as any);
    } else {
      await dispatch(createCoupon(payload) as any);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-9999">
      <div className="bg-white p-8 rounded-2xl w-[700px] max-h-[90vh] overflow-y-auto shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-center">
          {isEdit ? "Update Coupon" : "Create Coupon"}
        </h2>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-gray-600">Coupon Code</label>
            <input
              className="border p-3 w-full outline-0"
              placeholder="SAVE50"
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Type</label>
            <select
              className="border p-3 w-full outline-0"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FLAT">Flat</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Discount Value</label>
            <input
              type="number"
              className="border p-3 w-full outline-0"
              placeholder="50"
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Min Purchase Amount</label>
            <input
              type="number"
              className="border p-3 w-full outline-0"
              placeholder="1000"
              value={form.minPurchaseAmount}
              onChange={(e) =>
                handleChange("minPurchaseAmount", e.target.value)
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="datetime-local"
              className="border p-3 w-full outline-0"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="datetime-local"
              className="border p-3 w-full outline-0"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            className="border p-3 w-full outline-0"
            rows={3}
            placeholder="Festival special discount"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
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

export default CreateCouponModal;
