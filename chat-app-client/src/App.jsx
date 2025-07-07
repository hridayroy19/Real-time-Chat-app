import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Toaster from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { authuser } = useContext(AuthContext);
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={ authuser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authuser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/porfile"
          element={authuser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
