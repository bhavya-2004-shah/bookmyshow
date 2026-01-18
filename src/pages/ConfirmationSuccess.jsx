import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BASE_URL =
  "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000";

const ConfirmationSuccess = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const sessionId = new URLSearchParams(search).get("session_id");

  const [matchedOrder, setMatchedOrder] = useState(null);

  // 🔐 Get token & expiry
  const token = localStorage.getItem("token");
  const expireAt = localStorage.getItem("expireAt");

  // 🚫 Redirect if not logged in or token expired
  useEffect(() => {
    if (!token || (expireAt && Date.now() / 1000 > Number(expireAt))) {
      localStorage.clear();
      navigate("/");
    }
  }, [token, expireAt, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!sessionId) throw new Error("Session ID missing");

        console.log("🔍 Session ID:", sessionId);

        const res = await axios.get(`${BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orders = res.data;

        const foundOrder = orders.find(
          (o) => o.transactionId === sessionId
        );

        if (!foundOrder) throw new Error("Order not found");

        setMatchedOrder(foundOrder);

        console.log(
          `🔗 Session ${sessionId} mapped to Order ${foundOrder.id}`
        );
      } catch (err) {
        console.error("❌ Error:", err.message);
      }
    };

    if (token) fetchOrder();
  }, [sessionId, token]);

  return (
    <div className="h-screen bg-sky-50 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold mb-8">Payment Successful</h1>

      <div className="w-36 h-36 rounded-full bg-green-100 flex items-center justify-center mb-8">
        <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-5xl">
          ✓
        </div>
      </div>

      <button
        onClick={() => {
          if (matchedOrder?.id) {
            navigate(`/my-ticket/${matchedOrder.id}`);
          } else {
            console.log("❌ Order not loaded yet");
          }
        }}
        className="w-64 py-3 border-2 border-blue-500 text-blue-500 rounded-lg font-medium mb-4 hover:bg-blue-500 hover:text-white transition"
      >
        View Ticket
      </button>

      <button
        onClick={() => navigate("/movi")}
        className="w-64 py-3 border-2 border-gray-300 text-gray-500 rounded-lg font-medium hover:bg-gray-200 transition"
      >
        Back to Homepage
      </button>
    </div>
  );
};

export default ConfirmationSuccess;
