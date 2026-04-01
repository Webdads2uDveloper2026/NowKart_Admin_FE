"use client";
import { useEffect, useState } from "react";
import ResuableFields from "../../components/Container/Fields/ResuableFields";
import image1 from "../../assets/nowcartlogo.png";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { clearAuthState, loginAdmin } from "../../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../components/Container/Popup/PopupProvider";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showPopup } = usePopup();
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);
  const { loading, error, success } = useSelector(
    (state: RootState) => state.auth,
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    dispatch(loginAdmin(formData));
  };

  useEffect(() => {
    if (success) {
      showPopup("success", "Login successful!");
      navigate("/");
      dispatch(clearAuthState());
    }

    if (error) {
      showPopup("error", error || "Login failed");
      dispatch(clearAuthState());
    }
  }, [success, error]);

  return (
    <div
      className={`min-h-screen flex ${
        isDarkMode ? "bg-[#101828] text-white" : "bg-[#002428] text-white"
      }`}
    >
      <div className="w-1/2 flex flex-col justify-center items-center">
        <img src={image1} alt="logo" />
      </div>

      <div className="w-px my-20 bg-gray-400"></div>
      <div className="w-1/2 flex flex-col justify-center items-center px-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h2 className="text-3xl font-light text-white text-center mb-2">
            Welcome
          </h2>

          <p className="text-sm text-gray-400 mb-6 text-center">
            Please login to Admin Dashboard.
          </p>

          <ResuableFields
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-4"
          />

          <ResuableFields
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mb-4"
          />
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
