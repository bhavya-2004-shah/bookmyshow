

import { useNavigate } from "react-router-dom";

const TheatreCard = ({ id, name, location }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/theatre/${id}`)} 
      className="flex items-center justify-between px-6 py-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition cursor-pointer"
    >
      {/* LEFT */}
      <div>
        <h2 className="text-blue-700 font-semibold text-base">
          {name}
        </h2>

        <div className="flex items-center text-sm text-gray-600 mt-1">
          <span className="mr-1">📍</span>
          <span>{location || "Ahmedabad"}</span>
        </div>
      </div>

      {/* RIGHT ARROW */}
      <div className="text-blue-600 text-xl">
        →
      </div>
    </div>
  );
};

export default TheatreCard;
