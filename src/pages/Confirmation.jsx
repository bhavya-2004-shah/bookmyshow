import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "/api";

const Confirmation = () => {
  const { showTimeId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showTimeData, setShowTimeData] = useState(null);

  const token = localStorage.getItem("token");
  const expireAt = localStorage.getItem("expireAt");

  useEffect(() => {
    if (!token || (expireAt && Date.now() / 1000 > Number(expireAt))) {
      localStorage.clear();
      navigate("/");
      return;
    }

    fetchShowTime();
  }, []);

  const fetchShowTime = async () => {
    try {
      const res = await fetch(`${BASE_URL}/show-times/${showTimeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setShowTimeData(data.data);
    } catch (err) {
      console.error("❌ Error fetching showtime:", err);
    }
  };

  if (!showTimeData) return <div className="p-10">Loading confirmation...</div>;

  const selectedSeats = state?.bookedSeats || [];
  const priceMap = state?.priceMap || {};

  const totalPrice = state?.totalPrice || 0;

  const serviceChargePercent = 6;
  const serviceCharge = Math.round((totalPrice * serviceChargePercent) / 100);
  const finalTotal = totalPrice + serviceCharge;

  const handlePayment = async () => {
    try {
      const payloadSeats = selectedSeats.map((s) => ({
        row: s.seat.charAt(0),
        column: Number(s.seat.slice(1)),
        layoutType: s.layoutType,
      }));

      const payload = {
        showtimeId: showTimeId,
        seatData: { seats: payloadSeats },
      };

      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.paymentUrl) {
        throw new Error(data.message || "Payment failed");
      }

      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("❌ Payment Error:", err);
      navigate("/failed");
    }
  };

  return (
    <div className="min-h-screen  bg-sky-100 flex justify-center py-10">

      <div className="w-[360px] bg-white border-2 border-blue-400 rounded-2xl shadow-lg p-6">

        <h2 className="text-blue-600 font-bold text-lg mb-4">
          Booking Detail
        </h2>

        <p className="text-xs text-gray-400">Movie Title</p>
        <p className="text-sm font-semibold uppercase mb-4">
          {showTimeData.movie.name}
        </p>

        <p className="text-xs text-gray-400">Theatre</p>
        <p className="text-sm font-semibold mb-4">
          {showTimeData.screen.theaterName}
        </p>

        <p className="text-xs text-gray-400">Date</p>
        <p className="text-sm font-semibold mb-4">
          {new Date(showTimeData.startTime).toDateString()}
        </p>

        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className="text-xs text-gray-400">Seats</p>
            <p className="font-semibold">
              {selectedSeats.map((s) => s.seat).join(", ")}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Time</p>
            <p className="font-semibold">
              {new Date(showTimeData.startTime).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* PRICE DETAILS */}
        <div className="border-t pt-4 mt-4 text-xs space-y-1">
          <p className="text-blue-600 font-semibold">Transaction Detail</p>

          {selectedSeats.map((s, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{s.layoutType} Seat</span>
              <span>₹{priceMap[s.layoutType]}</span>
            </div>
          ))}

          <div className="flex justify-between">
            <span>Service Charge</span>
            <span>₹{serviceCharge}</span>
          </div>

          <div className="flex justify-between font-bold text-sm border-t pt-2 mt-2">
            <span>Total Payment</span>
            <span>₹{finalTotal}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full mt-4 border-2 border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition"
        >
          Total Pay ₹{finalTotal} Proceed
        </button>

        <button
          onClick={() => navigate("/movie")}
          className="w-full mt-2 border text-gray-400 py-2 rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default Confirmation;
