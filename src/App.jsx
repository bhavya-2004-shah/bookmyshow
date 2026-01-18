import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import { Routes, Route } from "react-router-dom";
import Navbar from './pages/Navbar';
import Movie from './pages/Movie';
import Layout from "./components/Layout";
import Theatre from './pages/Theatre';
import TheatreShows from './pages/TheatreShows';
import MovieShows from './pages/MovieShows'
import SeatBooking from './pages/SeatBooking';
import SeatSelection from './pages/SeatSelection';
import Confirmation from './pages/Confirmation';
import ConfirmationSuccess from './pages/ConfirmationSuccess';
import ConfirmationFailed from './pages/ConfirmationFailed';
import Tickets from './pages/Tickets';
import MyTickets from './pages/MyTickets';

const App = () => {
  return (
    
      <Routes>
        {/* Routes WITH Navbar */}
        <Route element={<Layout />}>
          <Route path="/movie" element={<Movie />} />
          <Route path="/theatre" element={<Theatre />} />
           <Route path="/theatre/:id" element={<TheatreShows />} /> 
           <Route path="/movie/:id" element={<MovieShows />} />
            <Route path="/my-tickets" element={<MyTickets/>} />
        </Route>
            {/* STEP 1 */}
        <Route
          path="/seat-booking/:showTimeId"
          element={<SeatBooking />}
        />

        {/* STEP 2 */}
        <Route
          path="/seat-selection/:showTimeId/:seats"
          element={<SeatSelection />}
        />
         <Route path="/confirmation/:showTimeId" element={<Confirmation />} />

  
<Route path="/success" element={<ConfirmationSuccess />} />
<Route path="/failed" element={<ConfirmationFailed />} />
<Route path="/my-ticket/:orderId" element={<Tickets />} />



        {/* Routes WITHOUT Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    

  )
}

export default App
