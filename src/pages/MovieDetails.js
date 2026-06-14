
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getRecommendations,
  getTrailer,
} from "../services/movieService";


import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion, getDoc,
} from "firebase/firestore";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trailerKey, setTrailerKey] = useState(null);

  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadMovie();
  }, [id]);

const loadMovie = async () => {
  try {
    const movieData = await getMovieDetails(id);
    setMovie(movieData);

    const recData = await getRecommendations(id);
    setRecommendations(recData.results || []);

    const trailerData = await getTrailer(id);
    setTrailerKey(trailerData.key);
  } catch (error) {
    console.error(error);
  }
};

  const addToWatchlist = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("Please login first");
        return;
      }

      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      const userData = userSnap.data();

      const watchlist = userData.watchlist || [];

      const alreadyExists = watchlist.some(
        (item) => item.id === movie.id
      );

      if (alreadyExists) {
        alert("Movie already in watchlist ❤️");
        return;
      }

      await updateDoc(userRef, {
        watchlist: arrayUnion({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          releaseDate: movie.release_date,
        }),
      });

      alert("Added to Watchlist ❤️");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const addToFavorites = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    const userData = userSnap.data();

    const favorites = userData.favorites || [];

    const alreadyExists = favorites.some(
      (item) => item.id === movie.id
    );

    if (alreadyExists) {
      alert("Movie already in favorites ⭐");
      return;
    }

    await updateDoc(userRef, {
      favorites: arrayUnion({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        releaseDate: movie.release_date,
      }),
    });

    alert("Added to Favorites ⭐");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  if (!movie) {
    return (
      <div
        style={{
          color: "white",
          padding: "30px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          color: "white",
          padding: "30px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            display: "flex",
            gap: "40px",
            marginBottom: "50px",
          }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: "300px",
              borderRadius: "10px",
            }}
          />

          <div>
            <h1>{movie.title}</h1>

            <h3>
              ⭐ Rating: {movie.vote_average?.toFixed(1)}
            </h3>

            <p>
              <strong>Genre:</strong>{" "}
              {movie.genres?.map((g) => g.name).join(", ")}
            </p>

            <p>
              <strong>Release Date:</strong>{" "}
              {movie.release_date}
            </p>

            <p>
              <strong>Runtime:</strong>{" "}
              {movie.runtime} min
            </p>

            <br />

            <p>{movie.overview}</p>

            <br />

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                onClick={addToWatchlist}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                ❤️ Add To Watchlist
              </button>

              <button
                onClick={addToFavorites}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                ⭐ Add To Favorites
              </button>
              
            </div>
            {trailerKey && (
  <div
    style={{
      marginBottom: "40px",
    }}
  >
    <h2>🎬 Official Trailer</h2>

    <iframe
      width="50%"
      height="500"
      src={`https://www.youtube.com/embed/${trailerKey}`}
      title="Movie Trailer"
      frameBorder="0"
      allowFullScreen
      style={{
        borderRadius: "10px",
      }}
    />
  </div>
)}
          </div>
          
        </div>

        <h2>🎬 Movies Like This</h2>

        <div className="movie-grid">
          {recommendations.slice(0, 8).map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title}
              />

              <div className="movie-info">
                <h3>{movie.title}</h3>

                <p>
                  {movie.release_date
                    ? movie.release_date.split("-")[0]
                    : "N/A"}
                </p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
}

export default MovieDetails;