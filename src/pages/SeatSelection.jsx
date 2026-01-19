import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "/api";

const safeParseLayout = (layout) => {
  try {
    return JSON.parse(layout) || [];
  } catch {
    return [];
  }
};

const SeatSelection = () => {
  const { showTimeId, seats } = useParams();
  const navigate = useNavigate();

  const [layoutData, setLayoutData] = useState([]);
  const [priceMap, setPriceMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);

  const token = localStorage.getItem("token");
  const maxSeats = Number(seats);

  useEffect(() => {
    fetchShowTime();
  }, []);

  const fetchShowTime = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/show-times/${showTimeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const showTime = res.data.data;

      const parsedLayout = safeParseLayout(showTime.screen.layout);
      setLayoutData(parsedLayout);

      const prices = {};
      showTime.price.forEach((p) => {
        prices[p.layoutType] = p.price;
      });
      setPriceMap(prices);

      const alreadyBooked = showTime.orders.flatMap((order) =>
        order.seatData.seats.map((s) => `${s.row}${s.column}`)
      );

      setBookedSeats(alreadyBooked);
    } catch (err) {
      console.error("Error fetching showtime:", err.message);
    }
  };

  const handleSeatClick = (seatId, layoutType) => {
    if (bookedSeats.includes(seatId)) return;

    const row = seatId[0];
    const startNumber = parseInt(seatId.slice(1));

    let autoSelected = [];

    for (let i = 0; i < maxSeats; i++) {
      const nextSeat = `${row}${startNumber + i}`;
      if (bookedSeats.includes(nextSeat)) break;
      autoSelected.push({ seat: nextSeat, layoutType });
    }

    setSelectedSeats(autoSelected);

    const total = autoSelected.reduce(
      (sum, s) => sum + (priceMap[s.layoutType] || 0),
      0
    );

    setTotalAmount(total);
  };

  if (!layoutData.length)
    return <div className="text-center mt-10">Loading seats...</div>;

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-100 via-white to-blue-100 flex flex-col items-center px-10 py-6">

      {/* 🔹 Top Header */}
      <div className="w-full flex mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 text-xl font-medium hover:underline"
        >
          ← Back
        </button>
        <h1 className="px-10 text-5xl font-bold text-blue-700">
          Select Seat
        </h1>
      </div>

      {/* 🔹 Seat Layout */}
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-5xl">
        {layoutData.map((section, idx) => {
          const { type, layout } = section;
          const [start, end] = layout.columns;

          return (
            <div key={idx} className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  ₹{priceMap[type]} {type}
                </span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {layout.rows.map((row) => (
                <div key={row} className="flex justify-center gap-2 mb-2">
                  {Array.from({ length: end - start + 1 }, (_, i) => {
                    const seatId = `${row}${start + i}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.some((s) => s.seat === seatId);

                    return (
                      <div
                        key={seatId}
                        onClick={() => handleSeatClick(seatId, type)}
                        className={`w-9 h-7 flex items-center justify-center text-xs rounded border m-1
                          ${
                            isBooked
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : isSelected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white hover:border-blue-500 cursor-pointer"
                          }`}
                      >
                        {seatId}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}

        {/* Screen Bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-300 rounded-full"></div>
          <p className="text-center text-gray-500 text-sm mt-2">
            All eyes this way please!
          </p>
        </div>
      </div>

      {/* 🔹 Pay Button */}
      <button
        className="mt-8 mb-12 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-gray-400"
        disabled={selectedSeats.length !== maxSeats}
        onClick={() =>
          navigate(`/confirmation/${showTimeId}`, {
            state: {
              showId: showTimeId,
              bookedSeats: selectedSeats,
              totalPrice: totalAmount,
              priceMap,
            },
          })
        }
      >
        Pay ₹{totalAmount}
      </button>
    </div>
  );
};

export default SeatSelection;
