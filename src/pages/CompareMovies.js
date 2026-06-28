import {
  useState,
  useEffect,
} from "react";
import Navbar from "../components/Navbar";
import "./CompareMovies.css";
import {
  searchMovies,
  getMovieDetails,
} from "../services/movieService";

function CompareMovies() {

  const [search, setSearch] = useState("");

  const [selectedMovies, setSelectedMovies] =
    useState([]);
  const [results, setResults] =
    useState([]);
  const [comparisonData, setComparisonData] =
    useState([]);

  useEffect(() => {

    if (search.trim().length < 2) {
      setResults([]);
      return;
    }

    const loadMovies = async () => {

      try {

        const data =
          await searchMovies(search);

        setResults(data.slice(0, 8));

      } catch (error) {

        console.error(error);

      }

    };

    const timer =
      setTimeout(loadMovies, 300);

    return () =>
      clearTimeout(timer);

  }, [search]);

  useEffect(() => {

    const loadComparison = async () => {

      const movies = await Promise.all(

        selectedMovies.map((movie) =>
          getMovieDetails(movie.id)
        )

      );

      setComparisonData(movies);

    };

    if (selectedMovies.length >= 2) {

      loadComparison();

    } else {

      setComparisonData([]);

    }

  }, [selectedMovies]);

  const addMovie = (movie) => {

    if (selectedMovies.length >= 5) {
      alert("Maximum 5 movies can be compared.");
      return;
    }

    const exists = selectedMovies.find(
      (item) => item.id === movie.id
    );

    if (exists) {
      alert("Movie already added.");
      return;
    }

    setSelectedMovies([
      ...selectedMovies,
      movie,
    ]);

    setSearch("");
    setResults([]);
  };

  return (
    <>
      <Navbar />

      <div className="compare-page">

        <h1>
          ⚖ Compare Movies
        </h1>

        <p>
          Compare up to
          <strong> 5 movies</strong>
        </p>

        <input
          className="compare-search"
          placeholder="Search movie..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />



        <div className="selected-container">
          {results.length > 0 && (

            <div className="search-results">

              {results.map((movie) => (

                <div
                  key={movie.id}
                  className="search-item"
                >

                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                  />

                  <div>

                    <h4>{movie.title}</h4>

                    <p>

                      {movie.release_date
                        ?.split("-")[0]}

                    </p>

                  </div>
                  <button
                    onClick={() => addMovie(movie)}
                  >
                    Add
                  </button>

                </div>

              ))}

            </div>

          )}
        </div>

        <h2>
          Selected
          ({selectedMovies.length}/5)
        </h2>
        <div className="selected-movies">

          {selectedMovies.map((movie) => (

            <div
              key={movie.id}
              className="selected-card"
            >

              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />

              <h4>{movie.title}</h4>

              <button
                onClick={() =>
                  setSelectedMovies(
                    selectedMovies.filter(
                      (m) => m.id !== movie.id
                    )
                  )
                }
              >
                ❌ Remove
              </button>

            </div>

          ))}
          {comparisonData.length >= 2 && (

            <div className="comparison-table">

              <h2>
                📊 Comparison
              </h2>

              <table>

                <tbody>

                  <tr>

                    <th>Feature</th>

                    {comparisonData.map(movie => (

                      <th key={movie.id}>

                        {movie.title}

                      </th>

                    ))}

                  </tr>
                  <tr>
                    <td>🖼 Poster</td>

                    {comparisonData.map(movie => (
                      <td key={movie.id}>
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                          style={{
                            width: "120px",
                            borderRadius: "10px"
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>🎬 Title</td>

                    {comparisonData.map(movie => (
                      <td key={movie.id}>
                        {movie.title}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>📝 Tagline</td>

                    {comparisonData.map(movie => (
                      <td key={movie.id}>
                        {movie.tagline || "-"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>📖 Overview</td>

                    {comparisonData.map(movie => (
                      <td key={movie.id}>
                        {movie.overview
                          ? movie.overview.length > 180
                            ? movie.overview.slice(0, 180) + "..."
                            : movie.overview
                          : "-"}
                      </td>
                    ))}
                  </tr>
                  <tr>

                    <td>⭐ Rating</td>

                    {comparisonData.map(movie => (

                      <td key={movie.id}>

                        {movie.vote_average}

                      </td>

                    ))}

                  </tr>

                  <tr>

                    <td>📅 Release</td>

                    {comparisonData.map(movie => (

                      <td key={movie.id}>

                        {movie.release_date}

                      </td>

                    ))}

                  </tr>

                  <tr>

                    <td>⏱ Runtime</td>

                    {comparisonData.map(movie => (

                      <td key={movie.id}>

                        {movie.runtime} min

                      </td>

                    ))}

                  </tr>

                  <tr>

                    <td>🎭 Genres</td>

                    {comparisonData.map(movie => (

                      <td key={movie.id}>

                        {movie.genres
                          .map(g => g.name)
                          .join(", ")}

                      </td>

                    ))}

                  </tr>

                  <tr>

                    <td>💰 Budget</td>

                    {comparisonData.map(movie => (

                      <td key={movie.id}>

                        ${movie.budget.toLocaleString()}

                      </td>

                    ))}

                  </tr>

                  <tr>

                    <td>💵 Revenue</td>

                    {comparisonData.map(movie => (

                      <td key={movie.id}>

                        ${movie.revenue.toLocaleString()}

                      </td>

                    ))}

                  </tr>

                  <tr>

                    <td>🌍 Language</td>

                    {comparisonData.map(movie => (

                      <td key={movie.id}>

                        {movie.original_language.toUpperCase()}

                      </td>

                    ))}

                  </tr>

                </tbody>

              </table>

            </div>

          )}
        </div>



      </div>
    </>
  )

}

export default CompareMovies;