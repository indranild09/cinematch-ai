import { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


import {
  searchMovies,
  getTrendingMovies,
  getPopularMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getMoviesByGenre,
} from "../services/movieService";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedMoodGenres, setSelectedMoodGenres] = useState([]);
  const [moodMovies, setMoodMovies] = useState([]);

  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  const moods = {
    Happy: [
      { id: 35, name: "Comedy" },
      { id: 10751, name: "Family" },
      { id: 16, name: "Animation" },
    ],

    Sad: [{ id: 18, name: "Drama" }],

    Thriller: [
      { id: 53, name: "Thriller" },
      { id: 9648, name: "Mystery" },
      { id: 80, name: "Crime" },
    ],

    Romantic: [{ id: 10749, name: "Romance" }],

    Motivational: [
      { id: 36, name: "History" },
      { id: 99, name: "Documentary" },
    ],

    Scary: [{ id: 27, name: "Horror" }],

    Adventurous: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 14, name: "Fantasy" },
      { id: 878, name: "Science Fiction" },
      { id: 10752, name: "War" },
    ],

    Musical: [{ id: 10402, name: "Music" }],

    Misc: [
      { id: 10770, name: "TV Movie" },
      { id: 37, name: "Western" },
    ],
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const trendingData = await getTrendingMovies();
      const popularData = await getPopularMovies();
      const upcomingData = await getUpcomingMovies();
      const topRatedData = await getTopRatedMovies();

      setTrending(trendingData.results || []);
      setPopular(popularData.results || []);
      setUpcoming(upcomingData.results || []);
      setTopRated(topRatedData.results || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const searchMovieHandler = async () => {
  if (!searchTerm.trim()) return;

  try {
    const results = await searchMovies(searchTerm);

    if (Array.isArray(results)) {
      setMovies(results);
    } else {
      setMovies(results.results || []);
    }
  } catch (error) {
    console.error(error);
  }
};

  const handleGenreClick = async (genreId, genreName) => {
    try {
      const data = await getMoviesByGenre(genreId);

      setSelectedGenre(genreName);
      setMovies(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    setSelectedMoodGenres([]);
    setMoodMovies([]);
  };

  const handleMoodGenreToggle = (genreId) => {
    setSelectedMoodGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const findMoodMovies = async () => {
    try {
      if (selectedMoodGenres.length === 0) {
        alert("Select at least one genre");
        return;
      }

      const results = await Promise.all(
        selectedMoodGenres.map((id) =>
          getMoviesByGenre(id)
        )
      );

      const mergedMovies = results.flat();

      const uniqueMovies = Array.from(
        new Map(
          mergedMovies.map((movie) => [
            movie.id,
            movie,
          ])
        ).values()
      );

      setMoodMovies(uniqueMovies);
    } catch (error) {
      console.error(error);
    }
  };

  const renderMovieCard = (movie) => (
    <div
      className="movie-card"
      key={movie.id}
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
  );

  if (loading) {
  return (
    <>
      <Navbar />

      <div className="loader-container">
        <div className="loader-spinner"></div>

        <div className="loader-text">
          Loading Movies...
        </div>
      </div>
    </>
  );
}

  return (
    <>
      <Navbar />

      <div className="app">
        <h1>CineMatch AI 🎬</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchMovieHandler();
              }
            }}
          />

          <button onClick={searchMovieHandler}>
            Search
          </button>
        </div>

        {/* MOOD EXPLORER */}

        <div className="mood-section">
          <h2>😊 Browse By Mood</h2>

          <div className="moods">
            {Object.keys(moods).map((mood) => (
              <button
                key={mood}
                className={
                  selectedMood === mood
                    ? "mood-btn active-mood"
                    : "mood-btn"
                }
                onClick={() =>
                  handleMoodClick(mood)
                }
              >
                {mood}
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mood-genre-box">
              <h3>
                Genres For {selectedMood}
              </h3>

              <div className="checkbox-container">
                {moods[selectedMood].map(
                  (genre) => (
                    <label key={genre.id}>
                      <input
                        type="checkbox"
                        checked={selectedMoodGenres.includes(
                          genre.id
                        )}
                        onChange={() =>
                          handleMoodGenreToggle(
                            genre.id
                          )
                        }
                      />
                      {genre.name}
                    </label>
                  )
                )}
              </div>

              <button
                className="find-btn"
                onClick={findMoodMovies}
              >
                Find Movies
              </button>
            </div>
          )}

          {moodMovies.length > 0 && (
            <>
              <h2>
                🎬 Movies For {selectedMood}
              </h2>

              <div className="movie-grid">
                {moodMovies.map(renderMovieCard)}
              </div>
            </>
          )}
        </div>

        {/* EXISTING GENRE FILTER */}

        <h2>🎭 Browse By Genre</h2>

        <div className="genre-container">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className="genre-btn"
              onClick={() =>
                handleGenreClick(
                  genre.id,
                  genre.name
                )
              }
            >
              {genre.name}
            </button>
          ))}
        </div>

        {selectedGenre && (
          <h2>🎬 {selectedGenre} Movies</h2>
        )}

        {movies.length > 0 && (
          <>
            <h2>🔍 Search Results</h2>

            <div className="movie-grid">
              {movies.map(renderMovieCard)}
            </div>
          </>
        )}
        <br />
        <br />

        <h2>🔥 Trending This Week</h2>

        <div className="movie-grid">
          {trending
            .slice(0, 10)
            .map(renderMovieCard)}
        </div>

        <br />
        <br />

        <h2>🏆 Top Rated Movies</h2>

        <div className="movie-grid">
          {topRated
            .slice(0, 10)
            .map(renderMovieCard)}
        </div>

        <h2>⭐ Popular Movies</h2>

        <div className="movie-grid">
          {popular
            .slice(0, 10)
            .map(renderMovieCard)}
        </div>
        <br />
        <br />

        <h2>🎬 Upcoming Movies</h2>

        <div className="movie-grid">
          {upcoming
            .slice(0, 10)
            .map(renderMovieCard)}
        </div>
      </div>
    </>
  );
}

export default Home;