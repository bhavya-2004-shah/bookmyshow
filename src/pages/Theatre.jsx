import React, { useState, useEffect } from 'react';
import TheatreCard from '../components/TheatreCard';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000";

const Theatre = () => {
  const [theatres, setTheatre] = useState([]);
  const navigate = useNavigate();

  // 🔐 AUTH
  const token = localStorage.getItem("token");
  const expireAt = localStorage.getItem("expireAt");

  // 🚫 BLOCK DIRECT ACCESS
  useEffect(() => {
    if (!token || (expireAt && Date.now() / 1000 > Number(expireAt))) {
      localStorage.clear();
      navigate("/");
      return;
    }

    fetchTheatreNames();
  }, [token, expireAt, navigate]);

  const fetchTheatreNames = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/theaters`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ token from localStorage
        },
      });

      setTheatre(response.data.data);
    } catch (err) {
      console.error("error in fetching theatre names", err);
    }
  };

  return (
    <div className="px-8 mt-8 space-y-4 max-w-5xl mx-auto">

      <div className="px-8 mt-4 flex gap-4">
        <Link
          to="/movie"
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md text-sm"
        >
          Movie
        </Link>

        <Link
          to="/theatre"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
        >
          Theatre
        </Link>
      </div>

      {theatres.map((theatre) => (
        <TheatreCard
          key={theatre.id}
          id={theatre.id}
          name={theatre.name}
          location={theatre.location}
        />
      ))}
    </div>
  );
};

export default Theatre;
