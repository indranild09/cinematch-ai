import {
  useState,
  useEffect,
} from "react";
import Navbar from "../components/Navbar";
import "./CompareMovies.css";
import {
  searchMovies,
} from "../services/movieService";

function CompareMovies() {

  const [search, setSearch] = useState("");

  const [selectedMovies, setSelectedMovies] =
    useState([]);
  const [results, setResults] =
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
            {selectedMovies.length >= 2 && (
              <button
                className="compare-btn"
              >
                ⚖ Compare Movies
              </button>
            )}
          </div>

       

      </div>
    </>
  )

}

export default CompareMovies;