import React, { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "./TicketCard";
import { useNavigate } from "react-router-dom";

const BASE_URL = "/api";

const MyTickets = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  // 🔐 Get token + expiry from localStorage
  const token = localStorage.getItem("token");
  const expireAt = localStorage.getItem("expireAt");

  // 🚫 Redirect if token missing or expired
  useEffect(() => {
    if (!token || (expireAt && Date.now() / 1000 > Number(expireAt))) {
      localStorage.clear();
      navigate("/");
      return;
    }

    fetchOrders();
  }, [token, expireAt, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(res.data);
      console.log("🎫 All Tickets:", res.data);
    } catch (err) {
      console.error(
        "❌ Error fetching tickets:",
        err.response?.data || err.message
      );
    }
  };

  const upcoming = tickets.filter(
    (t) => new Date(t.showtime.startTime) > new Date()
  );

  const history = tickets.filter(
    (t) => new Date(t.showtime.startTime) <= new Date()
  );

  return (
    <div className="h-screen bg-sky-50 p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 rounded-lg border ${activeTab === "upcoming"
              ? "bg-blue-500 text-white"
              : "border-blue-500 text-blue-500"
            }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-lg border ${activeTab === "history"
              ? "bg-blue-500 text-white"
              : "border-blue-500 text-blue-500"
            }`}
        >
          History
        </button>
      </div>

      <div className="flex flex-wrap gap-6">
        {(activeTab === "upcoming" ? upcoming : history).map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
