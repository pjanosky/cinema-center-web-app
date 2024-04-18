import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Login from "./Account/Login/Login";
import { useQueryCurrentUser } from "./Account/hooks";
import Home from "./Home/Home";
import ListDetails from "./List/ListDetails";
import MovieDetails from "./Movies/MovieDetails";
import Profile from "./Profile/Profile";
import Navigation from "./Navigation/Navigation";
import Register from "./Account/Register/Register";
import Search from "./Search/Search";

function App() {
  return (
    <div
      style={{
        backgroundColor: "var(--background-1)",
        minHeight: "100vh",
        color: "var(--foreground-1)",
      }}
    >
      <BrowserRouter>
        <Navigation>
          <Routes>
            <Route path="" element={<Navigate to="/home" replace={true} />} />
            <Route path="login/*" element={<Login />} />
            <Route path="register/*" element={<Register />} />
            <Route path="home/*" element={<Home />} />
            <Route path="profile/:id/*" element={<Profile />} />
            <Route path="profile" element={<NavigateToProfile />} />
            <Route path="search/*" element={<Search />} />
            <Route path="details/:id/*" element={<MovieDetails />} />
            <Route path="lists/:id/*" element={<ListDetails />} />
          </Routes>
        </Navigation>
      </BrowserRouter>
    </div>
  );
}

function NavigateToProfile() {
  const navigate = useNavigate();
  const { data, isPending } = useQueryCurrentUser();
  useEffect(() => {
    if (isPending) return;
    if (data) {
      navigate(`/profile/${data._id}`, { replace: true });
    } else {
      navigate("/login?redirect=profile", { replace: true });
    }
  }, [data, isPending, navigate]);

  return <div></div>;
}

export default App;
