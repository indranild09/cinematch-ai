import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { searchAll } from "../services/movieService";

function SearchResults() {
  const [searchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const query =
    searchParams.get("q");

  const [actors, setActors] =
    useState([]);

  const [movies, setMovies] =
    useState([]);

  const [tvShows, setTVShows] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadResults();
  }, [query]);

  const loadResults = async () => {
    try {
      setLoading(true);

      const data =
        await searchAll(query);

      const results =
        data.results || [];

      setActors(
        results.filter(
          (item) =>
            item.media_type ===
              "person" &&
            item.profile_path
        )
      );

      setMovies(
        results.filter(
          (item) =>
            item.media_type ===
              "movie" &&
            item.poster_path
        )
      );

      setTVShows(
        results.filter(
          (item) =>
            item.media_type ===
              "tv" &&
            item.poster_path
        )
      );

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderActorCard =
    (actor) => (
      <div
        className="movie-card"
        key={actor.id}
        onClick={() =>
          navigate(
            `/actor/${actor.id}`
          )
        }
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
          alt={actor.name}
        />

        <div className="movie-info">
          <h3>{actor.name}</h3>

          <p>👤 Actor</p>
        </div>
      </div>
    );

  const renderMovieCard =
    (movie) => (
      <div
        className="movie-card"
        key={movie.id}
        onClick={() =>
          navigate(
            `/movie/${movie.id}`
          )
        }
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />

        <div className="movie-info">
          <h3>{movie.title}</h3>

          <p>🎬 Movie</p>
        </div>
      </div>
    );

  const renderTVCard =
    (show) => (
      <div
        className="movie-card"
        key={show.id}
        onClick={() =>
          navigate(
            `/tv/${show.id}`
          )
        }
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.name}
        />

        <div className="movie-info">
          <h3>{show.name}</h3>

          <p>📺 TV Show</p>
        </div>
      </div>
    );

  if (loading) {
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

      <div className="app">
        <h1>
          Search Results:
          {" "}
          {query}
        </h1>

        {actors.length > 0 && (
          <>
            <h2>👤 Actors</h2>

            <div className="movie-grid">
              {actors.map(
                renderActorCard
              )}
            </div>
          </>
        )}

        {movies.length > 0 && (
          <>
            <h2>🎬 Movies</h2>

            <div className="movie-grid">
              {movies.map(
                renderMovieCard
              )}
            </div>
          </>
        )}

        {tvShows.length > 0 && (
          <>
            <h2>📺 TV Shows</h2>

            <div className="movie-grid">
              {tvShows.map(
                renderTVCard
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SearchResults;