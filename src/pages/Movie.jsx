import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Movie = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const expireAt = localStorage.getItem("expireAt");

  const [movieNames, setMovieNames] = useState([]);

  // 🔐 Redirect if not logged in or token expired
  useEffect(() => {
    if (!token || (expireAt && Date.now() / 1000 > Number(expireAt))) {
      localStorage.clear();
      navigate("/");
      return;
    }
  }, [token, expireAt, navigate]);

  useEffect(() => {
    const fetchMovieNames = async () => {
      try {
        const response = await axios.get(
          "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000/movies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMovieNames(response.data);
      } catch (err) {
        console.error("Error fetching movie name:", err);
      }
    };

    if (token) fetchMovieNames();
  }, [token]);

  return (
    <div>
      <div className="px-8 pt-6">
        <h1 className="text-2xl font-semibold text-blue-600">Now Showing</h1>
      </div>

      <div className="px-8 mt-4 flex gap-4">
        <Link to="/movie" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
          Movie
        </Link>
        <Link to="/theatre" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md text-sm">
          Theatre
        </Link>
      </div>

      <div className="px-8 mt-8 flex flex-wrap gap-18">
        {movieNames.map((movie) => (
          <MovieCard key={movie.id} id={movie.id} image={movie.image} name={movie.name} />
        ))}
      </div>
    </div>
  );
};

export default Movie;
