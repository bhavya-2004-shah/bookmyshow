import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BASE_URL = "/api";

const Tickets = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  const token = localStorage.getItem("token");
  const expireAt = localStorage.getItem("expireAt");

  useEffect(() => {
    if (!token || (expireAt && Date.now() / 1000 > Number(expireAt))) {
      localStorage.clear();
      navigate("/");
    }
  }, [token, expireAt, navigate]);

  useEffect(() => {
    if (orderId && token) {
      fetchTicket(orderId);
    }
  }, [orderId, token]);

  const fetchTicket = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTicket(res.data);
      console.log("🎫 Ticket Loaded:", res.data);
    } catch (err) {
      console.error("❌ Failed to fetch ticket:", err.response?.data || err.message);
    }
  };

  if (!ticket) return <h2 className="text-center mt-10">Loading ticket...</h2>;

  const date = new Date(ticket.showtime.startTime).toDateString();
  const movie = ticket.showtime.movie.name;
  const theater = ticket.showtime.screen.theaterName;
  const seats = ticket.seatData.seats.map((s) => `${s.row}${s.column}`);
  const time = new Date(ticket.showtime.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // 🎟️ SAFE PDF DOWNLOAD
  const downloadTicket = async () => {
    const ticketCard = document.getElementById("ticket-card");

    if (!ticketCard) {
      console.error("Ticket element not found");
      return;
    }

    const cleanClone = (node) => {
      const newNode = node.cloneNode(true);

      const walk = (el) => {
        el.removeAttribute("class");
        el.removeAttribute("style");

        el.style.backgroundColor = "#ffffff";
        el.style.color = "#000000";
        el.style.fontFamily = "Arial";

        for (let child of el.children) walk(child);
      };

      walk(newNode);
      return newNode;
    };

    const clone = cleanClone(ticketCard);

    Object.assign(clone.style, {
      width: "320px",
      padding: "20px",
      border: "2px solid #2563eb",
      borderRadius: "16px",
      backgroundColor: "#ffffff",
      color: "#000000",
    });

    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 15, 15, imgWidth, imgHeight);
      pdf.save("ticket.pdf");



    } catch (err) {
      console.error("❌ PDF generation failed:", err);
      alert("Download failed");
    }

    document.body.removeChild(clone);
  };

  return (
    <div className="h-screen bg-sky-50 flex items-center justify-center">
      <div
        id="ticket-card"
        className="w-80 border-2 border-blue-400 rounded-2xl p-5 shadow-md bg-white"
      >
        <p className="text-blue-500 font-medium text-sm">Date</p>
        <p className="text-gray-800 font-semibold text-lg mb-4">{date}</p>

        <p className="text-blue-500 font-medium text-sm">Movie Title</p>
        <p className="text-gray-800 font-semibold text-lg mb-4 uppercase">
          {movie}
        </p>

        <p className="text-blue-500 font-medium text-sm">Theater</p>
        <p className="text-gray-800 font-semibold text-lg mb-4">{theater}</p>

        <div className="flex justify-between mb-4">
          <div>
            <p className="text-blue-500 font-medium text-sm">
              Ticket ({seats.length})
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              {seats.join(", ")}
            </p>
          </div>

          <div>
            <p className="text-blue-500 font-medium text-sm">Hours</p>
            <p className="text-gray-800 font-semibold text-lg">{time}</p>
          </div>
        </div>

        <button
          onClick={downloadTicket}
          className="w-full border-2 border-blue-500 text-blue-500 font-medium py-1 rounded-lg hover:bg-blue-500 hover:text-white transition"
        >
          Download Ticket
        </button>

        <button
          onClick={() => navigate("/movie")}
          className="w-full mt-10 py-3 border-2 border-gray-300 text-gray-500 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default Tickets;
