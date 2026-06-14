const API_BASE = "https://cinematch-api-seven.vercel.app";

export const searchMovies = async (query) => {
  const res = await fetch(`${API_BASE}/api/search?query=${query}`);
  return res.json();
};

export const getMovieDetails = async (id) => {
  const res = await fetch(`${API_BASE}/api/movie/${id}`);
  return res.json();
};

export const getTrendingMovies = async () => {
  const res = await fetch(`${API_BASE}/api/trending`);
  return res.json();
};

export const getPopularMovies = async () => {
  const res = await fetch(`${API_BASE}/api/popular`);
  return res.json();
};

export const getRecommendations = async (id) => {
  const res = await fetch(`${API_BASE}/api/recommendations/${id}`);
  return res.json();
};

export const getMoviesByGenre = async (genreId) => {
  const response = await fetch(
    `https://cinematch-api-seven.vercel.app/api/genre/${genreId}`
  );

  const data = await response.json();

  return data.results;
};

export const getTrailer = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/trailer/${id}`
  );

  return res.json();
};