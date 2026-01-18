import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL =
  "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000";

const TheatreShows = () => {
  const { id: theaterId } = useParams();
  const navigate = useNavigate();

  const [moviesMap, setMoviesMap] = useState({});
  const [movieNames, setMovieNames] = useState({});
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allDates, setAllDates] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchMovies(token);
    fetchScreensAndShows(token);
  }, []);

  // 🎬 Fetch Movies for Theatre
  const fetchMovies = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/theaters/${theaterId}/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const movies = res.data?.data?.movies || [];
      const map = {};
      movies.forEach((m) => (map[m.id] = m.name));
      setMovieNames(map);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  // 🎥 Fetch Screens & Showtimes
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

      for (let screen of screens) {
        const res = await axios.get(`${BASE_URL}/screens/${screen.id}`, config);
        const showTimes = res.data?.data?.screen?.showTimes || [];

        showTimes.forEach((show) => {
          const formattedDate = new Date(show.startTime).toLocaleDateString(
            "en-IN",
            { day: "numeric", month: "short" }
          );

          collectedDates.push(formattedDate);

          if (!groupedMovies[show.movieId]) {
            groupedMovies[show.movieId] = {
              movieId: show.movieId,
              showTimes: [],
            };
          }

          groupedMovies[show.movieId].showTimes.push(show);
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
    <div className="p-6 bg-blue-50">
   

      <div className="flex gap-3 flex-wrap mb-6">
        {allDates.map((date) => (
          <button
            key={date}
            onClick={() => {
              setSelectedDate(date);
              setSelectedShow(null);
            }}
            className={`px-3 py-1 border rounded ${
              selectedDate === date ? "bg-blue-600 text-white" : "bg-white-200"
            }`}
          >
            {date}
          </button>
        ))}
      </div>

      {/* 🎬 Movies */}
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
            className="border-t pt-4 pb-6 mb-6 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg  text-blue-600">
                {movieNames[movie.movieId] || "Loading Movie..."}
              </h2>

              <div className="flex gap-3 mt-3 flex-wrap">
                {filteredShows.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => setSelectedShow(show)}
                    className={`px-3 py-1 rounded border ${
                      selectedShow?.id === show.id
                        ? "bg-blue-600 text-white"
                        : "bg-white-400 hover:bg-blue-600"
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
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white"
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
