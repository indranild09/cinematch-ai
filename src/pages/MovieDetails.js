import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieDetails,
  getRecommendations,
  getTrailer,
  getWatchProviders,
  getMovieCast,
  getMovieReviews,
} from "../services/movieService";
import "./MovieDetails.css";

import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
   getDoc, arrayUnion,
} from "firebase/firestore";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [trailerKey, setTrailerKey] = useState(null);
  const [providers, setProviders] = useState([]);
  const [providerLink, setProviderLink] = useState("");
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const getProviderUrl = (providerName) => {
    const providerUrls = {
      Netflix: "https://www.netflix.com",
      "Amazon Prime Video": "https://www.primevideo.com",
      "Amazon Prime Video with Ads": "https://www.primevideo.com",
      "Amazon Video": "https://www.primevideo.com",
      "Apple TV Store": "https://tv.apple.com",
      YouTube: "https://www.youtube.com",
      "Google Play Movies": "https://play.google.com/store/movies",
      Zee5: "https://www.zee5.com",
      "VI movies and tv": "https://www.myvi.in/movies-and-tv",
      "Sony Pictures Amazon Channel": "https://www.primevideo.com",
      "Disney Plus Hotstar": "https://www.hotstar.com/in",
      JioHotstar: "https://www.hotstar.com/in",
      SonyLIV: "https://www.sonyliv.com",
    };

    return providerUrls[providerName] || providerLink;
  };

  useEffect(() => {
  loadMovie();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

  const loadMovie = async () => {
  try {
    setLoading(true);
      const movieData = await getMovieDetails(id);
      setMovie(movieData);
      saveRecentView(movieData);

      const recData = await getRecommendations(id);
      setRecommendations(recData.results || []);

      const castData = await getMovieCast(id);

      setCast(castData.cast || []);

      const reviewData =
        await getMovieReviews(id);

      setReviews(reviewData.results || []);

      const trailerData = await getTrailer(id);
      setTrailerKey(trailerData.key);
      const providerData =
        await getWatchProviders(id);

      setProviders(providerData.providers || []);
      setProviderLink(providerData.link || "");
      setLoading(false);
      console.log("Providers:", providerData.providers);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
const saveRecentView =
  async (movieData) => {
    try {
      const user =
        auth.currentUser;

      if (!user) return;

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap =
        await getDoc(userRef);

      const userData =
        userSnap.data() || {};

      let recentViews =
        userData.recentViews || [];

      recentViews =
        recentViews.filter(
          (item) =>
            !(
              item.id ===
                movieData.id &&
              item.type ===
                "movie"
            )
        );

      recentViews.unshift({
        id: movieData.id,
        type: "movie",
        title:
          movieData.title,
        poster:
          movieData.poster_path,
        viewedAt:
          Date.now(),
      });

      recentViews =
        recentViews.slice(
          0,
          20
        );

      await updateDoc(
        userRef,
        {
          recentViews,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  const addToWatchlist = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("Please login first");
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
        toast.info("Movie already in watchlist ❤️");
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

      toast.success("Added to Watchlist ❤️");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const addToFavorites = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("Please login first");
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
        toast.info("Movie already in favorites ⭐");
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

      toast.success("Added to Favorites ⭐");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (loading || !movie) {
    return (
  <>
    <Navbar />

    <div className="loader-container">
      <div className="loader-spinner"></div>

      <div className="loader-text">
        Loading Movie Details...
      </div>
    </div>
  </>
);
  }

  return (
    <>
      <Navbar />
      <div className="movie-details-container">
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div className="movie-header">
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />

          <div className="movie-content">
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

            <div className="action-buttons">
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
                <br />
                <h2>🎬 Official Trailer</h2>

                <iframe
                  width="100%"
                  height="500"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allowFullScreen
                  className="trailer-frame"
                />
              </div>
            )}

            <div
              style={{
                marginTop: "30px",
                marginBottom: "30px",
              }}
            >
              <h2>
                📺 Available On ({providers.length})
              </h2>

              {providers.length > 0 ? (
                <div className="providers-grid">
                  {providers.map((provider) => (
                    <div
                      className="provider-card"
                      key={provider.provider_id}
                      onClick={() =>
                        window.open(
                          getProviderUrl(
                            provider.provider_name
                          ),
                          "_blank"
                        )

                      }

                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                        alt={provider.provider_name}
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "12px",
                          objectFit: "cover",
                        }}
                      />

                      <p
                        style={{
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        {provider.provider_name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    color: "#aaa",
                    marginTop: "10px",
                  }}
                >
                  Streaming availability not found in India.
                </p>
              )}
            </div>
          </div>

        </div>

        <br />
        <br />

        <div
          style={{
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          <h2>🎭 Cast</h2>

          <div className="movie-grid">
            {cast.slice(0, 12).map((actor) => (
              <div
  key={actor.cast_id || actor.id}
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
        </div>

        <br />
        <br />

        <div
          style={{
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          <h2>⭐ Reviews</h2>
<br/>
          {reviews.length > 0 ? (
            <div className="reviews-container">
              {reviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="review-card"
                >
                  <h3>
                    {review.author}
                  </h3>

                  <p>
                    {review.content.length > 500
                      ? review.content.substring(
                        0,
                        500
                      ) + "..."
                      : review.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>
              No reviews available.
            </p>
          )}
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
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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
          <ToastContainer
  position="top-right"
  autoClose={2500}
  theme="dark"
/>
    </>
  );
}

export default MovieDetails;