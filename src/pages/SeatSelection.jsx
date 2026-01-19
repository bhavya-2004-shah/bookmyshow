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

    // ⛔ STOP if the seat is already booked
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
    <div className="min-h-screen bg-blue-100 flex flex-col items-center px-20">

      <div className="bg-blue-100 mt-10 p-8 rounded-2xl w-full">
        {layoutData.map((section, idx) => {
          const { type, layout } = section;
          const [start, end] = layout.columns;

          return (
            <div key={idx} className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  ₹{priceMap[type]} {type}
                </span>
                <div className="flex-1 border-t border-gray-400"></div>
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
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
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

        <div className="mt-6">
          <div className="h-2 bg-gray-400 rounded-full"></div>
          <p className="text-center text-gray-600 text-sm mt-1">
            All eyes this way please!
          </p>
        </div>
      </div>

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
