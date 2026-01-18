import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expireAt");
    localStorage.removeItem("user"); // if stored
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Cinemas Logo" className="w-20 h-20 object-contain" />
      </div>

      {/* Navigation Text */}
      <div className="flex gap-6 items-center text-blue-500 font-medium">
        <span 
          onClick={() => navigate("/movie")}
          className="hover:text-blue-700 cursor-pointer"
        >
          Home
        </span>

        <span 
          onClick={() => navigate("/my-tickets")}
          className="hover:text-blue-700 cursor-pointer"
        >
          My Tickets
        </span>
      </div>

      {/* Logout */}
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
