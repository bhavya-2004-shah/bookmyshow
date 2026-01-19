import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "/api";

const TheatreShows = () => {
  const { id: theaterId } = useParams();
  const navigate = useNavigate();

  const [moviesMap, setMoviesMap] = useState({});
  const [movieNames, setMovieNames] = useState({});
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allDates, setAllDates] = useState([]);
  const [theater, setTheater] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchMovies(token);
    fetchScreensAndShows(token);
  }, []);

  // 🎭 Fetch theatre details + movies
  const fetchMovies = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/theaters/${theaterId}/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data;
      setTheater(data);

      const movies = data?.movies || [];
      const map = {};
      movies.forEach((m) => (map[m.id] = m.name));
      setMovieNames(map);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  // 🎥 Fetch screens + filter showtimes for next 7 days
  const fetchScreensAndShows = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const screenRes = await axios.get(
        `${BASE_URL}/theaters/${theaterId}/screens`,
        config
      );

      const screens = screenRes.data;
      let groupedMovies = {};
      let collectedDates = [];

      const today = new Date();
      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);

      for (let screen of screens) {
        const res = await axios.get(`${BASE_URL}/screens/${screen.id}`, config);
        const showTimes = res.data?.data?.screen?.showTimes || [];

        showTimes.forEach((show) => {
          const showDate = new Date(show.startTime);

          if (showDate >= today && showDate <= next7Days) {
            const formattedDate = showDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            });

            collectedDates.push(formattedDate);

            if (!groupedMovies[show.movieId]) {
              groupedMovies[show.movieId] = {
                movieId: show.movieId,
                showTimes: [],
              };
            }

            groupedMovies[show.movieId].showTimes.push(show);
          }
        });
      }

      const uniqueDates = [...new Set(collectedDates)];
      setAllDates(uniqueDates);

      if (uniqueDates.length > 0) {
        setSelectedDate(uniqueDates[0]);
      }

      setMoviesMap(groupedMovies);
    } catch (err) {
      console.error("Error fetching theatre shows:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sky-100 p-6">

      {/* 🎭 Theatre Header */}
      {theater && (
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-blue-600 mb-2"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-blue-700">{theater.name}</h1>
          <p className="text-sm text-gray-600">📍 {theater.location}</p>
        </div>
      )}

      {/* 📅 Date Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {allDates.map((date) => {
          const fullDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            parseInt(date)
          );

          const day = fullDate.toLocaleDateString("en-IN", { weekday: "short" });

          return (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setSelectedShow(null);
              }}
              className={`min-w-[90px] px-3 py-2 rounded-lg border text-center transition ${selectedDate === date
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-700 hover:bg-blue-500 border-gray-300"
                }`}
            >
              <div className="text-xs font-semibold">{day}</div>
              <div className="text-sm">{date}</div>
            </button>
          );
        })}
      </div>

      {/* 🎬 Movies + Shows */}
      {Object.values(moviesMap).map((movie) => {
        const filteredShows = movie.showTimes.filter(
          (show) =>
            new Date(show.startTime).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            }) === selectedDate
        );

        if (filteredShows.length === 0) return null;

        return (
          <div
            key={movie.movieId}
            className="bg-white rounded-xl p-5 mb-6 shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold text-blue-700">
                {movieNames[movie.movieId] || "Loading Movie..."}
              </h2>

              <div className="flex gap-3 mt-3 flex-wrap">
                {filteredShows.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => setSelectedShow(show)}
                    className={`px-4 py-2 rounded-lg border ${selectedShow?.id === show.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-blue-500 border-gray-300"
                      }`}
                  >
                    {new Date(show.startTime).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate(`/seat-booking/${selectedShow?.id}`)}
              disabled={!selectedShow}
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white disabled:opacity-100"
            >
              Book Now
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TheatreShows;
