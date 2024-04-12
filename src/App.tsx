import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "./Account/Login/Login";
import Register from "./Account/Register/Register";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import Search from "./Search/Search";
import MovieDetails from "./Movies/MovieDetails";
import Navigation from "./Navigation/Navigation";
import { useQueryCurrentUser } from "./Account/hooks";
import ListDetails from "./List/ListDetails";

function App() {
  return (
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
