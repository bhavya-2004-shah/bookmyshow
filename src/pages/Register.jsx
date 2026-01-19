import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const BASE_URL = "/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/auth/signup`, formData);

      setSuccess(res.data.message || "Signup successful!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[95%] h-[90vh] border-2 border-blue-500 flex">

        {/* LEFT */}
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

        {/* RIGHT */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-[360px]">

            <h2 className="text-xl font-semibold mb-6">
              Create an account
            </h2>

            <form className="space-y-4" autoComplete="off" onSubmit={handleSignup}>

              <div>
                <label>First Name</label>
                <input
                  autoComplete="off"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label>Last Name</label>
                <input
                  autoComplete="off"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  autoComplete="off"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
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
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <button
                disabled={loading}
                className="w-full border border-blue-500 text-blue-600 py-2 rounded hover:bg-blue-500 hover:text-white"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <p className="text-sm text-center mt-4">
              Already have an account?
              <Link to="/" className="text-blue-500 ml-1 underline">
                Log In
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
