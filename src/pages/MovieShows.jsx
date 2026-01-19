import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "/api";

const MovieShows = () => {
  const navigate = useNavigate();
  const { id: movieId } = useParams();

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  const [availableDates, setAvailableDates] = useState([]);
  const [availableTheatres, setAvailableTheatres] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const movieRes = await axios.get(
          `${BASE_URL}/movies/${movieId}`,
          axiosConfig
        );
        setMovie(movieRes.data);

        const theatres = movieRes.data.theaters || [];

        const screensRes = await Promise.all(
          theatres.map((t) =>
            axios.get(`${BASE_URL}/theaters/${t.id}/screens`, axiosConfig)
          )
        );

        let screens = [];
        screensRes.forEach((res, i) => {
          const theatre = theatres[i];
          res.data.forEach((s) => {
            screens.push({
              ...s,
              theatreId: theatre.id,
              theatreName: theatre.name,
            });
          });
        });

        const screenDetails = await Promise.all(
          screens.map((screen) =>
            axios.get(`${BASE_URL}/screens/${screen.id}`, axiosConfig)
          )
        );

        let allShows = [];

        screenDetails.forEach((res, i) => {
          const screen = screens[i];
          const showTimes = res.data.data.screen.showTimes || [];

          showTimes
            .filter((s) => s.movieId === movieId)
            .forEach((s) => {
              allShows.push({
                ...s,
                theatreId: screen.theatreId,
                theatreName: screen.theatreName,
                screenNumber: res.data.data.screen.screenNumber,
              });
            });
        });

        setShows(allShows);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastAllowed = new Date(today);
        lastAllowed.setDate(today.getDate() + 6); // only 7 days including today

        const filteredDates = [
          ...new Set(
            allShows
              .map((s) => new Date(s.startTime))
              .filter((d) => d >= today && d <= lastAllowed)
              .map((d) => d.toISOString().split("T")[0])
          ),
        ].sort((a, b) => new Date(a) - new Date(b));

        setAvailableDates(filteredDates);
        setSelectedDate(filteredDates[0] || null);

      } catch (err) {
        console.error("Error loading movie shows:", err);
      }
    };

    fetchData();
  }, [movieId]);

  useEffect(() => {
    if (!selectedDate) return;

    const theatres = [
      ...new Map(
        shows
          .filter(
            (s) =>
              new Date(s.startTime).toISOString().split("T")[0] === selectedDate
          )
          .map((s) => [
            s.theatreId,
            { theatreId: s.theatreId, theatreName: s.theatreName },
          ])
      ).values(),
    ];

    setAvailableTheatres(theatres);
    setSelectedTheatre(theatres[0] || null);
    setSelectedShow(null);
  }, [selectedDate, shows]);

  const timesByTheatre = useMemo(() => {
    if (!selectedTheatre || !selectedDate) return [];

    return shows.filter(
      (s) =>
        s.theatreId === selectedTheatre.theatreId &&
        new Date(s.startTime).toISOString().split("T")[0] === selectedDate
    );
  }, [selectedTheatre, selectedDate, shows]);

  // 🎯 Format date label
  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const diff = Math.floor((date - today) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-blue-100 flex px-8 py-6 gap-10">

      {/* LEFT */}
      <div className="flex-1 space-y-10">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-sky-600">
          ← Back
        </button>

        {/* DATE */}
        <div>
          <h2 className="text-blue-700 font-semibold text-lg mb-3">Date</h2>
          <div className="flex gap-3 overflow-x-auto">
            {availableDates.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${selectedDate === d
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                  }`}
              >
                {getDateLabel(d)}
              </button>
            ))}
          </div>
        </div>

        {/* THEATRE */}
        {availableTheatres.length > 0 && (
          <div>
            <h2 className="text-blue-700 font-semibold text-lg mb-3">Theater</h2>
            <div className="flex flex-wrap gap-3">
              {availableTheatres.map((t) => (
                <button
                  key={t.theatreId}
                  onClick={() => {
                    setSelectedTheatre(t);
                    setSelectedShow(null);
                  }}
                  className={`px-3 py-2 rounded-lg border ${selectedTheatre?.theatreId === t.theatreId
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-blue-50"
                    }`}
                >
                  {t.theatreName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TIME */}
        {timesByTheatre.length > 0 && (
          <div>
            <h2 className="text-blue-700 font-semibold text-lg mb-3">Time</h2>
            <div className="flex flex-wrap gap-3">
              {timesByTheatre.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedShow(s)}
                  className={`px-3 py-2 rounded-lg border ${selectedShow?.id === s.id
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-blue-50"
                    }`}
                >
                  {new Date(s.startTime).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-[340px] h-[500px] bg-white rounded-2xl shadow-lg p-6 space-y-5">
        {movie && (
          <>
            <img src={movie.image} alt={movie.name} className="rounded-xl w-full h-[220px] object-cover" />
            <h2 className="text-blue-700 font-bold text-lg">{movie.name}</h2> <p>Dscription: {movie.description || "2h 30m"}</p> <div className="text-gray-600 font-bold text-sm space-y-1"> <p>Duration: {movie.duration || "2h 30m"}</p> <p>Rating: {movie.rating || "9/10"}</p> <p>Genre: {movie.genre || "Action"}</p> </div> </>
        )}

        {selectedDate && selectedTheatre && selectedShow && (
          <div className="border border-blue-500 rounded-xl p-4 space-y-2 mt-20">
            <h3 className="text-blue-600 font-semibold">{selectedTheatre.theatreName}</h3>
            <p>{new Date(selectedShow.startTime).toLocaleString("en-IN")}</p>
            <button
              onClick={() => navigate(`/seat-booking/${selectedShow.id}`)}
              className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg"
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieShows;
