import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const user = auth.currentUser;

    if (!user) return;

    const docRef = doc(db, "users", user.uid);

    const docSnap = await getDoc(docRef);

    const data = docSnap.data();

    setFavorites(data.favorites || []);
  };

  const removeFavorite = async (movieId) => {
    const user = auth.currentUser;

    if (!user) return;

    const docRef = doc(db, "users", user.uid);

    const docSnap = await getDoc(docRef);

    const currentFavorites =
      docSnap.data().favorites || [];

    const updatedFavorites =
      currentFavorites.filter(
        (movie) => movie.id !== movieId
      );

    await updateDoc(docRef, {
      favorites: updatedFavorites,
    });

    setFavorites(updatedFavorites);
  };

  return (
    <div className="watchlist-page">
      <h1>⭐ Favorites</h1>

      <div className="movie-grid">
        {favorites.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() =>
              navigate(`/movie/${movie.id}`)
            }
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
              alt={movie.title}
            />

            <h3>{movie.title}</h3>

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(movie.id);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;