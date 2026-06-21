import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./TVDetails.css";
import {
  getTVDetails,
} from "../services/movieService";

function TVDetails() {
  const { id } = useParams();

  const [show, setShow] =
    useState(null);

  useEffect(() => {
  const loadTV = async () => {
    try {
      const data = await getTVDetails(id);
      setShow(data);
    } catch (error) {
      console.error(error);
    }
  };

  loadTV();
}, [id]);

  

  if (!show) {
    return (
      <>
        <Navbar />
        <h2>Loading...</h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="tv-details-container">
        <div className="tv-header">
        <img
            className="tv-poster"
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.name}
          width="250"
        />     

     <div className="tv-content">
        <h1>{show.name}</h1>

        <h3>
          ⭐ {show.vote_average}
        </h3>

        <p>
          {show.overview}
        </p>

        <p>
          Seasons:
          {" "}
          {show.number_of_seasons}
        </p>

        <p>
          Episodes:
          {" "}
          {show.number_of_episodes}
        </p>
        </div>
        </div>
      </div>
    </>
  );
}

export default TVDetails;