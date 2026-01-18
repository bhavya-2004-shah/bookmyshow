import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL =
  "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000";

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

  // ===============================
  // FETCH DATA (FAST)
  // ===============================
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const movieRes = await axios.get(`${BASE_URL}/movies/${movieId}`, axiosConfig);
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
            screens.push({ ...s, theatreId: theatre.id, theatreName: theatre.name });
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

        const dates = [
          ...new Set(
            allShows.map((s) =>
              new Date(s.startTime).toISOString().split("T")[0]
            )
          ),
        ].sort((a, b) => new Date(a) - new Date(b));

        setAvailableDates(dates);
        setSelectedDate(dates[0] || null);

      } catch (err) {
        console.error("Error loading movie shows:", err);
      }
    };

    fetchData();
  }, [movieId]);

  // ===============================
  // FILTER THEATRES BY DATE
  // ===============================
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

  // ===============================
  // FILTER TIMES BY THEATRE + DATE
  // ===============================
  const timesByTheatre = useMemo(() => {
    if (!selectedTheatre || !selectedDate) return [];

    return shows.filter(
      (s) =>
        s.theatreId === selectedTheatre.theatreId &&
        new Date(s.startTime).toISOString().split("T")[0] === selectedDate
    );
  }, [selectedTheatre, selectedDate, shows]);

  return (
    <div className="min-h-screen bg-blue-50 p-8 flex gap-10">

      {/* LEFT SECTION */}
      <div className="flex-1 space-y-8">

        {/* DATE */}
        <div>
          <h2 className="text-xl mb-3 text-blue-700">Date</h2>
          <div className="flex gap-3 flex-wrap">
            {availableDates.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedDate === d ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {new Date(d).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })}
              </button>
            ))}
          </div>
        </div>

        {/* THEATRE */}
        {availableTheatres.length > 0 && (
          <div>
            <h2 className="text-xl  mb-3 text-blue-700">Theatre</h2>
            <div className="flex flex-wrap gap-3">
              {availableTheatres.map((t) => (
                <button
                  key={t.theatreId}
                  onClick={() => {
                    setSelectedTheatre(t);
                    setSelectedShow(null);
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedTheatre?.theatreId === t.theatreId
                      ? "bg-blue-600 text-white"
                      : "bg-white"
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
            <h2 className="text-xl  mb-3 text-blue-700">Time</h2>
            <div className="flex flex-wrap gap-3">
              {timesByTheatre.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedShow(s)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedShow?.id === s.id
                      ? "bg-blue-600 text-white"
                      : "bg-white"
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

      {/* RIGHT SECTION (same as your old UI) */}
      <div className="w-[360px] space-y-6  bg-white rounded-xl p-6 shadow-lg">

        {movie && (
          <>
            <img src={movie.image} alt={movie.name} className="rounded-xl w-full h-auto object-cover" />
            <h2 className="text-blue-700 font-bold text-lg">{movie.name}</h2>
            <p className="text-gray-600 text-sm">{movie.description}</p>
          </>
        )}

        {selectedDate && selectedTheatre && selectedShow && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-blue-600 font-bold text-lg">{selectedTheatre.theatreName}</h3>
            <p>{new Date(selectedShow.startTime).toLocaleDateString("en-IN")}</p>
            <p>{new Date(selectedShow.startTime).toLocaleTimeString("en-IN")}</p>

            <button
              onClick={() => navigate(`/seat-booking/${selectedShow.id}`)}
              className="w-full mt-4 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white"
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
