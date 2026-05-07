"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import image1 from "../../assets/nowcartlogo.png";
import type { RootState, AppDispatch } from "../../store/store";
import { clearAuthState, loginAdmin } from "../../store/slice/authSlice";
import { usePopup } from "../../components/Container/Popup/PopupProvider";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showPopup } = usePopup();

  const { isDarkMode } = useSelector(
    (state: RootState) => state.darkMode,
  );

  const { loading, error, success } = useSelector(
    (state: RootState) => state.auth,
  );

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      className={`min-h-screen flex items-center justify-center px-4 py-6 overflow-hidden ${isDarkMode
        ? "bg-[#081018]"
        : "bg-gradient-to-br from-[#00161A] via-[#002428] to-[#00353B]"
        }`}
    >
      <div className="absolute top-[-100px] left-[-100px] w-[220px] h-[220px] rounded-full bg-orange-500/20 blur-3xl"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[220px] h-[220px] rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div
        className={`relative w-full max-w-4xl rounded-[28px] overflow-hidden border backdrop-blur-xl shadow-2xl ${isDarkMode
          ? "bg-white/5 border-white/10"
          : "bg-white/10 border-white/10"
          }`}
      >
        <div className="grid lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-center items-center p-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>

            <div className="relative z-10 text-center">
              <div className="bg-white rounded-2xl p-5 shadow-xl inline-block mb-6">
                <img
                  src={image1}
                  alt="Now Cart"
                  className="w-36 object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold text-white mb-1">
                Welcome Back
              </h1>
              <p className="text-sm text-white/60 leading-7 max-w-sm">
                Login to access your admin dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="bg-white rounded-2xl p-4 shadow-xl">
                  <img
                    src={image1}
                    alt="Now Cart"
                    className="w-28 object-contain"
                  />
                </div>
              </div>
              <div className="mb-8 flex flex-col items-center text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Admin Login
                </h2>
                <p className="text-white/50 text-sm">
                  Sign in to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">
                    Email
                  </label>

                  <div
                    className={`flex items-center rounded-xl border transition-all ${isDarkMode
                      ? "bg-white/5 border-white/10 focus-within:border-orange-500"
                      : "bg-white/10 border-white/10 focus-within:border-orange-500"
                      }`}
                  >
                    <div className="pl-4 text-white/40">
                      <Mail size={18} />
                    </div>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-white/35"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">
                    Password
                  </label>

                  <div
                    className={`flex items-center rounded-xl border transition-all ${isDarkMode
                      ? "bg-white/5 border-white/10 focus-within:border-orange-500"
                      : "bg-white/10 border-white/10 focus-within:border-orange-500"
                      }`}
                  >
                    <div className="pl-4 text-white/40">
                      <Lock size={18} />
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-white/35"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-4 text-white/40 hover:text-white transition"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-red-400 text-sm text-center">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-semibold transition-all text-white cursor-pointer ${loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                    }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;