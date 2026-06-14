import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadWatchlist();
  }, []);

  const removeFromWatchlist = async (
    movieId
  ) => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const docRef = doc(
        db,
        "users",
        user.uid
      );

      const docSnap = await getDoc(
        docRef
      );

      const currentWatchlist =
        docSnap.data().watchlist || [];

      const updatedWatchlist =
        currentWatchlist.filter(
          (movie) =>
            movie.id !== movieId
        );

      await updateDoc(docRef, {
        watchlist: updatedWatchlist,
      });

      setWatchlist(updatedWatchlist);

      alert("Removed from Watchlist");
    } catch (error) {
      console.error(error);
    }
  };

  const loadWatchlist = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const docRef = doc(
        db,
        "users",
        user.uid
      );

      const docSnap = await getDoc(
        docRef
      );

      if (docSnap.exists()) {
        setWatchlist(
          docSnap.data().watchlist || []
        );
      }

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
            Loading Watchlist...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          color: "white",
        }}
      >
        <h1>❤️ My Watchlist</h1>

        <div className="movie-grid">
          {watchlist.map((movie) => (
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
                src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                alt={movie.title}
              />

              <div className="movie-info">
                <h3>{movie.title}</h3>

                <p>
                  {movie.releaseDate?.split(
                    "-"
                  )[0]}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(
                      movie.id
                    );
                  }}
                  style={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Remove from Watchlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Watchlist;