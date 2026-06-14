import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { getMovieDetails } from "../services/movieService";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [topGenre, setTopGenre] = useState("N/A");
  const [topMood, setTopMood] = useState("N/A");

  useEffect(() => {
    loadProfile();
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
      const user = auth.currentUser;

      if (!user) return;

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnap = await getDoc(
        userRef
      );

      if (!userSnap.exists()) return;

      const data = userSnap.data();

      setUserData(data);

      const savedMovies = [
        ...(data.watchlist || []),
        ...(data.favorites || []),
      ];

      if (savedMovies.length === 0) return;

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
        Object.keys(genreCounter).reduce(
          (a, b) =>
            genreCounter[a] >
            genreCounter[b]
              ? a
              : b,
          Object.keys(genreCounter)[0]
        );

      const moodWinner =
        Object.keys(moodCounter).reduce(
          (a, b) =>
            moodCounter[a] >
            moodCounter[b]
              ? a
              : b,
          Object.keys(moodCounter)[0]
        );

      setTopGenre(
        genreWinner || "N/A"
      );

      setTopMood(
        moodWinner || "N/A"
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) {
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
      </div>
    </>
  );
}

export default Profile;