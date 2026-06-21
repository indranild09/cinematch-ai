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

export const getWatchProviders = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/watch-providers/${id}`
  );

  return res.json();
};

export const getUpcomingMovies = async () => {
  const res = await fetch(
    `${API_BASE}/api/upcoming`
  );

  return res.json();
};

export const getTopRatedMovies = async () => {
  const res = await fetch(
    `${API_BASE}/api/top-rated`
  );

  return res.json();
};

export const getMovieCast = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/cast/${id}`
  );

  return res.json();
};

export const getMovieReviews = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/reviews/${id}`
  );

  return res.json();
};

export const getActorDetails = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/actor/${id}`
  );

  return res.json();
};

export const getActorMovies = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/actor/${id}/movies`
  );

  return res.json();
};

export const getActorSocial = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/actor/${id}/social`
  );

  return res.json();
};

export const getTrendingTV = async () => {
  const res = await fetch(
    `${API_BASE}/api/trending-tv`
  );

  return res.json();
};

export const getPopularTV = async () => {
  const res = await fetch(
    `${API_BASE}/api/popular-tv`
  );

  return res.json();
};

export const getTopRatedTV = async () => {
  const res = await fetch(
    `${API_BASE}/api/top-rated-tv`
  );

  return res.json();
};

export const getTVDetails = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/tv/${id}`
  );

  return res.json();
};

export const getTVCast = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/tv-cast/${id}`
  );

  return res.json();
};

export const getTVTrailer = async (id) => {
  const res = await fetch(
    `${API_BASE}/api/tv-trailer/${id}`
  );

  return res.json();
};

export const getTVRecommendations =
  async (id) => {
    const res = await fetch(
      `${API_BASE}/api/tv-recommendations/${id}`
    );

    return res.json();
  };