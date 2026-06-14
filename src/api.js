const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const SEARCH_MOVIE_URL = (query) =>
  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;

export const IMAGE_BASE_URL =
  "https://image.tmdb.org/t/p/w500";