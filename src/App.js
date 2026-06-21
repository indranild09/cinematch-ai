import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Watchlist from "./pages/Watchlist";
import Favorites from "./pages/Favorites";
import AIAssistant from "./pages/AIAssistant";
import { AuthProvider } from "./context/AuthContext";
import ActorDetails from "./pages/ActorDetails";
import TVDetails from "./pages/TVDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            }
          />

          <Route
            path="/actor/:id"
            element={
              <ProtectedRoute>
                <ActorDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tv/:id"
            element={
              <ProtectedRoute>
                <TVDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;