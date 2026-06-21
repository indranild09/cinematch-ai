import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getTVDetails,
  getTVCast,
  getTVTrailer,
  getTVRecommendations,
} from "../services/movieService";

import "./TVDetails.css";

function TVDetails() {
  const { id } = useParams();

  const [show, setShow] =
    useState(null);

const navigate = useNavigate();

const [cast, setCast] =
  useState([]);

const [trailerKey, setTrailerKey] =
  useState(null);

const [recommendations, setRecommendations] =
  useState([]);

useEffect(() => {
  const loadTV = async () => {
    try {
      const tvData =
        await getTVDetails(id);

      const castData =
        await getTVCast(id);

      const trailerData =
        await getTVTrailer(id);

      const recData =
        await getTVRecommendations(id);

      setShow(tvData);

      setCast(
        castData.cast || []
      );

      setTrailerKey(
        trailerData.key
      );

      setRecommendations(
        recData.results || []
      );
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

        <br />

{trailerKey && (
  <>
    <h2>🎬 Official Trailer</h2>

    <iframe
      width="100%"
      height="450"
      src={`https://www.youtube.com/embed/${trailerKey}`}
      title="Trailer"
      frameBorder="0"
      allowFullScreen
      className="tv-trailer"
    />
  </>
)}

<br />

<h2>🎭 Cast</h2>

<div className="movie-grid">
  {cast.slice(0, 12).map((actor) => (
    <div
      key={actor.id}
      className="movie-card"
      onClick={() =>
        navigate(`/actor/${actor.id}`)
      }
      style={{
        cursor: "pointer",
      }}
    >
      <img
        src={
          actor.profile_path
            ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={actor.name}
      />

      <div className="movie-info">
        <h3>{actor.name}</h3>

        <p>{actor.character}</p>
      </div>
    </div>
  ))}
</div>

<br />

<h2>📺 Similar TV Shows</h2>

<div className="movie-grid">
  {recommendations
    .slice(0, 8)
    .map((show) => (
      <div
        key={show.id}
        className="movie-card"
        onClick={() =>
          navigate(`/tv/${show.id}`)
        }
      >
        <img
          src={
            show.poster_path
              ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
              : "https://via.placeholder.com/300x450"
          }
          alt={show.name}
        />

        <div className="movie-info">
          <h3>{show.name}</h3>

          <p>
            {show.first_air_date
              ? show.first_air_date.split("-")[0]
              : "N/A"}
          </p>
        </div>
      </div>
    ))}
</div>
        </div>
        </div>
      </div>
    </>
  );
}

export default TVDetails;