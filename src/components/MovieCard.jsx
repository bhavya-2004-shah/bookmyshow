import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ id, image, name }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${id}`)}
      className="w-[180px] cursor-pointer transition-transform hover:scale-105"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-[260px] object-cover rounded-xl shadow-md"
      />

      <p className="mt-2 text-sm font-medium text-blue-600 text-center">
        {name}
      </p>
    </div>
  );
};

export default MovieCard;
