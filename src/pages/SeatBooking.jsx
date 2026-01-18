import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const SeatBooking = () => {
  const { showTimeId } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState(null);

  const handleSelectSeats = () => {
    if (!selectedSeats) return;

    // ✅ FIXED LINE
    navigate(`/seat-selection/${showTimeId}/${selectedSeats}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-[380px] text-center space-y-6">

        <h2 className="text-2xl font-semibold text-blue-600">
          How many seats?
        </h2>

        <div className="grid grid-cols-5 gap-4 justify-items-center">
          {[1,2,3,4,5,6,7,8,9,10].map((num) => (
            <div
              key={num}
              onClick={() => setSelectedSeats(num)}
              className={`w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer transition
                ${
                  selectedSeats === num
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                }`}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <Link
            to="/movie"
            className="flex-1 border border-gray-300 text-gray-400 py-2 rounded-lg text-center"
          >
            Cancel
          </Link>

          <button
            onClick={handleSelectSeats}
            disabled={!selectedSeats}
            className={`flex-1 py-2 rounded-lg transition
              ${
                selectedSeats
                  ? "border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white"
                  : "border border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
          >
            Select seats
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
