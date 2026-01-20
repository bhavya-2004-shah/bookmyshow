import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movie from "./pages/Movie";
import Theatre from "./pages/Theatre";
import TheatreShows from "./pages/TheatreShows";
import MovieShows from "./pages/MovieShows";
import SeatBooking from "./pages/SeatBooking";
import SeatSelection from "./pages/SeatSelection";
import Confirmation from "./pages/Confirmation";
import ConfirmationSuccess from "./pages/ConfirmationSuccess";
import ConfirmationFailed from "./pages/ConfirmationFailed";
import Tickets from "./pages/Tickets";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";

import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/movie" element={<Movie />} />
        <Route path="/theatre" element={<Theatre />} />
        <Route path="/theatre/:id" element={<TheatreShows />} />
        <Route path="/movie/:id" element={<MovieShows />} />
        <Route path="/my-tickets" element={<MyTickets />} />
      </Route>

   
      <Route
        path="/seat-booking/:showTimeId"
        element={
          <ProtectedRoute>
            <SeatBooking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/seat-selection/:showTimeId/:seats"
        element={
          <ProtectedRoute>
            <SeatSelection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/confirmation/:showTimeId"
        element={
          <ProtectedRoute>
            <Confirmation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <ConfirmationSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/failed"
        element={
          <ProtectedRoute>
            <ConfirmationFailed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-ticket/:orderId"
        element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        }
      />


      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
