import Navbar from "../components/Navbar";

function CompareMovies() {
  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1>⚖ Compare Movies</h1>

        <p>
          Compare up to <strong>5 movies</strong> side by side.
        </p>

        <br />

        <div
          style={{
            border: "2px dashed #555",
            borderRadius: "15px",
            padding: "60px",
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          🚧 Comparison Builder Coming Next...
        </div>
      </div>
    </>
  );
}

export default CompareMovies;