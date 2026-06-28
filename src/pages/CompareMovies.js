import { useState } from "react";
import Navbar from "../components/Navbar";
import "./CompareMovies.css";

function CompareMovies() {

  const [search,setSearch]=useState("");

  const [selectedMovies,setSelectedMovies]=
    useState([]);

  return(
    <>
      <Navbar/>

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
          onChange={(e)=>
            setSearch(e.target.value)
          }
        />

        <div className="selected-container">

          <h2>
            Selected
            ({selectedMovies.length}/5)
          </h2>

        </div>

      </div>
    </>
  )

}

export default CompareMovies;