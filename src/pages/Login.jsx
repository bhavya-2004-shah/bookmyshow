import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const BASE_URL = "/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setError("Please enter email and password");
    }

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/auth/login`, formData);

      const { accessToken, expireAt } = res.data.data;

      // Save token & expiry
      localStorage.setItem("token", accessToken);
      localStorage.setItem("expireAt", expireAt);

      navigate("/movie");

    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[95%] h-[90vh] border-2 border-blue-500 flex">

        <div className="w-1/2 bg-gradient-to-b from-blue-200 to-blue-50 p-10 flex flex-col justify-between">
          <img src={logo} alt="Logo" className="w-20 h-20" />
          <div className="text-gray-700 italic text-3xl leading-10">
            Welcome.
            <br />
            Begin your cinematic
            <br />
            adventure now with our
            <br />
            ticketing platform!
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-[360px]">

            <h2 className="text-xl  mb-6">Login to your account</h2>

            <form className="space-y-4" autoComplete="off" onSubmit={handleLogin}>

              <div>
                <label>Email</label>
                <input
                  autoComplete="off"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  autoComplete="off"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                disabled={loading}
                className="w-full border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-500 hover:text-white"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-sm text-center mt-4">
              Don&apos;t have an account?
              <Link to="/register" className="text-blue-500 ml-1">
                Register Here
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
