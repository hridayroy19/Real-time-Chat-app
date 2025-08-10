import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Register from "./pages/register";

const App = () => {
  const { authuser } = useContext(AuthContext);
  // console.log(authuser, "my data");

  return (
    <>
      <div className="bg-[url('/bgImage.svg')] bg-cover ">
        <Routes>
          <Route
            path="/"
            element={authuser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authuser ? <Login /> : <Navigate to="/" />}
          />
          <Route path="/register" element={<Register />} />

          <Route path="/porfile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
