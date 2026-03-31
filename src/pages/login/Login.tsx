"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ResuableFields from "../../components/Fields/ResuableFields";
import image1 from "../../assets/nowcartlogo.png";
import { loginAdmin } from "../../api/auth/authApi";

const Login = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useSelector((state: any) => state.darkMode);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!formData.email || !formData.password) {
            setError("Email and Password are required");
            return;
        }

        try {
            setLoading(true);
            const res = await loginAdmin(formData.email, formData.password);
            if (res?.data?.accessToken) {
                localStorage.setItem("token", res?.data?.accessToken);
            }
            navigate("/dashboard");
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.detail ||
                "Invalid email or password";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`min-h-screen flex ${isDarkMode ? "bg-[#101828] text-white" : "bg-[#002428] text-white"
                }`}
        >
            {/* LEFT SIDE */}
            <div className="w-1/2 flex flex-col justify-center items-center">
                <img src={image1} alt="logo" />
            </div>

            <div className="w-[1px] my-20 bg-gray-400"></div>

            {/* RIGHT SIDE */}
            <div className="w-1/2 flex flex-col justify-center items-center px-10">
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <h2 className="text-3xl font-light text-white text-center mb-2">
                        Welcome
                    </h2>

                    <p className="text-sm text-gray-400 mb-6 text-center">
                        Please login to Admin Dashboard.
                    </p>

                    {/* EMAIL */}
                    <ResuableFields
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mb-4"
                    />

                    {/* PASSWORD */}
                    <ResuableFields
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="mb-4"
                    />

                    {/* ERROR */}
                    {error && (
                        <p className="text-red-500 text-sm mb-4 text-center">
                            {error}
                        </p>
                    )}

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 rounded-lg font-medium transition-all ${loading
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