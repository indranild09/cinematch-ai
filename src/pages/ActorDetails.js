import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getActorDetails,
  getActorMovies,
  getActorSocial,
} from "../services/movieService";

import "./ActorDetails.css";

function ActorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] =
    useState(null);

  const [movies, setMovies] =
    useState([]);

  const [social, setSocial] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

useEffect(() => {
  const loadActor = async () => {
    try {
      setLoading(true);

      const actorData =
        await getActorDetails(id);

      const movieData =
        await getActorMovies(id);

      const socialData =
        await getActorSocial(id);

      setActor(actorData);

      setMovies(
        movieData.cast?.slice(0, 20) || []
      );

      setSocial(socialData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadActor();
}, [id]);

 

  if (loading || !actor) {
    return (
      <>
        <Navbar />
        <div
          style={{
            color: "white",
            padding: "30px",
          }}
        >
          Loading Actor...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="actor-container">
        <button
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="actor-header">
          <img
            className="actor-image"
            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
            alt={actor.name}
          />

          <div>
            <h1>{actor.name}</h1>

            <p>
              <strong>
                Known For:
              </strong>{" "}
              {actor.known_for_department}
            </p>

            <p>
              <strong>
                Birthday:
              </strong>{" "}
              {actor.birthday ||
                "Unknown"}
            </p>

            <p>
              <strong>
                Place Of Birth:
              </strong>{" "}
              {actor.place_of_birth ||
                "Unknown"}
            </p>

            <p>
              <strong>
                Popularity:
              </strong>{" "}
              {Math.round(
                actor.popularity
              )}
            </p>

            {social?.instagram_id && (
              <a
                href={`https://instagram.com/${social.instagram_id}`}
                target="_blank"
                rel="noreferrer"
              >
                📸 @
                {social.instagram_id}
              </a>
            )}
          </div>
        </div>

        <h2>Biography</h2>

        <p className="bio">
          {actor.biography ||
            "Biography unavailable."}
        </p>

        <h2>
          🎬 Filmography
        </h2>

        <div className="movie-grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() =>
                navigate(
                  `/movie/${movie.id}`
                )
              }
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450"
                }
                alt={movie.title}
              />

              <div className="movie-info">
                <h3>
                  {movie.title}
                </h3>

                <p>
                  {
                    movie.release_date?.split(
                      "-"
                    )[0]
                  }
                </p>

                <p>
                  {movie.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ActorDetails;