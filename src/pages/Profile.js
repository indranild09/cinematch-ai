import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { getMovieDetails } from "../services/movieService";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [topGenre, setTopGenre] = useState("N/A");
  const [topMood, setTopMood] = useState("N/A");
  const [loading, setLoading] = useState(true);
  const [recentViews, setRecentViews] =
  useState([]);

  useEffect(() => {
    loadProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moodMap = {
    Comedy: "😊 Happy",
    Family: "😊 Happy",
    Animation: "😊 Happy",

    Drama: "😢 Sad",

    Thriller: "😱 Thriller",
    Mystery: "😱 Thriller",
    Crime: "😱 Thriller",

    Romance: "❤️ Romantic",

    History: "💪 Motivational",
    Documentary: "💪 Motivational",

    Horror: "😈 Scary",

    Action: "🤠 Adventurous",
    Adventure: "🤠 Adventurous",
    Fantasy: "🤠 Adventurous",
    "Science Fiction": "🤠 Adventurous",
    War: "🤠 Adventurous",

    Music: "🎵 Musical",

    "TV Movie": "🎬 Misc",
    Western: "🎬 Misc",
  };

  const loadProfile = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap = await getDoc(
        userRef
      );

      if (!userSnap.exists()) {
        setLoading(false);
        return;
      }

      const data = userSnap.data();

      setUserData(data);
      setRecentViews(
  data.recentViews || []
);
      const savedMovies = [
        ...(data.watchlist || []),
        ...(data.favorites || []),
      ];

      if (savedMovies.length === 0) {
        setLoading(false);
        return;
      }

      const genreCounter = {};
      const moodCounter = {};

      for (const movie of savedMovies) {
        try {
          const details =
            await getMovieDetails(movie.id);

          details.genres?.forEach(
            (genre) => {
              genreCounter[genre.name] =
                (genreCounter[
                  genre.name
                ] || 0) + 1;

              const mood =
                moodMap[genre.name];

              if (mood) {
                moodCounter[mood] =
                  (moodCounter[mood] ||
                    0) + 1;
              }
            }
          );
        } catch (error) {
          console.error(error);
        }
      }

      const genreWinner =
        Object.keys(genreCounter).length > 0
          ? Object.keys(genreCounter).reduce(
              (a, b) =>
                genreCounter[a] >
                genreCounter[b]
                  ? a
                  : b
            )
          : "N/A";

      const moodWinner =
        Object.keys(moodCounter).length > 0
          ? Object.keys(moodCounter).reduce(
              (a, b) =>
                moodCounter[a] >
                moodCounter[b]
                  ? a
                  : b
            )
          : "N/A";

      setTopGenre(genreWinner);
      setTopMood(moodWinner);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loader-container">
          <div className="loader-spinner"></div>

          <div className="loader-text">
            Loading Profile...
          </div>
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Navbar />
        <div
          style={{
            color: "white",
            padding: "30px",
          }}
        >
          No profile data found.
        </div>
      </>
    );
  }

  const memberSince =
    userData.createdAt
      ? new Date(
          userData.createdAt
        ).toLocaleDateString()
      : "N/A";

  const watchlistCount =
    userData.watchlist?.length || 0;

  const favoriteCount =
    userData.favorites?.length || 0;

  const totalSaved =
    watchlistCount +
    favoriteCount;
    const sortedRecentViews =
  [...recentViews].sort(
    (a, b) =>
      b.viewedAt - a.viewedAt
  );

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <h1>👤 My Profile</h1>

        <div className="profile-grid">
          <div className="profile-card">
            <h3>📧 Email</h3>
            <p>{userData.email}</p>
          </div>

          <div className="profile-card">
            <h3>📅 Member Since</h3>
            <p>{memberSince}</p>
          </div>

          <div className="profile-card">
            <h3>❤️ Watchlist</h3>
            <p>{watchlistCount}</p>
          </div>

          <div className="profile-card">
            <h3>⭐ Favorites</h3>
            <p>{favoriteCount}</p>
          </div>

          <div className="profile-card">
            <h3>🏆 Total Saved</h3>
            <p>{totalSaved}</p>
          </div>

          <div className="profile-card">
            <h3>🎭 Top Genre</h3>
            <p>{topGenre}</p>
          </div>

          <div className="profile-card">
            <h3>😊 Top Mood</h3>
            <p>{topMood}</p>
          </div>
        </div>
{recentViews.length > 0 && (
  <>
    <h2
      style={{
        marginTop: "50px",
      }}
    >
      🕒 Recently Viewed
    </h2>

    <div className="movie-grid">
      {sortedRecentViews.map(
        (item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="movie-card"
            onClick={() => {
              if (
                item.type ===
                "movie"
              ) {
                navigate(
                  `/movie/${item.id}`
                );
              }

              if (
                item.type ===
                "tv"
              ) {
                navigate(
                  `/tv/${item.id}`
                );
              }

              if (
                item.type ===
                "actor"
              ) {
                navigate(
                  `/actor/${item.id}`
                );
              }
            }}
            style={{
              cursor: "pointer",
            }}
          >
            <img
  src={
    item.poster
      ? `https://image.tmdb.org/t/p/w500${item.poster}`
      : "https://via.placeholder.com/300x450?text=No+Image"
  }
  alt={item.title}
/>

            <div className="movie-info">
              <h3>
                {item.title}
              </h3>

              <p>
                {item.type ===
                  "movie" &&
                  "🎬 Movie"}

                {item.type ===
                  "tv" &&
                  "📺 TV Show"}

                {item.type ===
                  "actor" &&
                  "👤 Actor"}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  </>
)}
      </div>
    </>
  );
}

export default Profile;