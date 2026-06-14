import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
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

      const data = docSnap.data();

      setFavorites(
        data?.favorites || []
      );

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const removeFavorite = async (
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

      const currentFavorites =
        docSnap.data().favorites || [];

      const updatedFavorites =
        currentFavorites.filter(
          (movie) =>
            movie.id !== movieId
        );

      await updateDoc(docRef, {
        favorites: updatedFavorites,
      });

      setFavorites(updatedFavorites);
      toast.success(
  "Removed from Favorites ⭐"
);
    } catch (error) {
      toast.error(
  "Failed to remove favorite"
);
      console.error(error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loader-container">
          <div className="loader-spinner"></div>

          <div className="loader-text">
            Loading Favorites...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="watchlist-page">
        <h1>⭐ Favorites</h1>

        <div className="movie-grid">
          {favorites.map((movie) => (
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

              <h3>{movie.title}</h3>

              <button
                className="remove-btn-fvt"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(movie.id);
                }}
              >
                ⭐ Remove from Favorites
              </button>
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

export default Favorites;