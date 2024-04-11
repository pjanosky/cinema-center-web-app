import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "./Account/Login";
import Register from "./Account/Register";
import Home from "./Home";
import Profile from "./Profile";
import Search from "./Search";
import Details from "./Details";
import Navigation from "./Navigation";
import { useQueryUser } from "./Account/hooks";
import ListDetails from "./List";

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
          <Route path="details/:id/*" element={<Details />} />
          <Route path="list/:id/*" element={<ListDetails />} />
        </Routes>
      </Navigation>
    </BrowserRouter>
  );
}

function NavigateToProfile() {
  const navigate = useNavigate();
  const { data, isPending } = useQueryUser();
  useEffect(() => {
    if (!isPending) {
      if (data) {
        navigate(`profile/${data._id}`);
      } else {
        navigate("login");
      }
    }
  }, [data, isPending, navigate]);

  return <div></div>;
}

export default App;
