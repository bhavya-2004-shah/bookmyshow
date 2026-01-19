// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <img src={logo} alt="Logo" className="w-24 mb-6" />

      <h1 className="text-6xl font-bold text-blue-500">404</h1>
      <p className="text-xl mt-2">Oops! Page not found.</p>

      <p className="text-gray-400 mt-2 text-center max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
