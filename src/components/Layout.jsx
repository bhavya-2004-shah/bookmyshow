import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../pages/Navbar";

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expireAt = localStorage.getItem("expireAt");

    if (!token || (expireAt && Date.now() / 1000 > Number(expireAt))) {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
