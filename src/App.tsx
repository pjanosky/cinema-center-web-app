import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Login from "./Account/Login/Login";
import { useUserState } from "./Users/Hooks";
import Home from "./Home/Home";
import ListDetails from "./List/ListDetails";
import MovieDetails from "./Movies/MovieDetails";
import Profile from "./Profile/Profile";
import Navigation from "./Navigation/Navigation";
import Register from "./Account/Register/Register";
import Search from "./Search/Search";
import { Provider } from "react-redux";
import store from "./Store/Store";

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

function NavigateToProfile() {
  const navigate = useNavigate();
  const { currentUser, isPending } = useUserState();
  useEffect(() => {
    if (isPending) return;
    if (currentUser) {
      navigate(`/profile/${currentUser._id}`, { replace: true });
    } else {
      navigate("/login?redirect=profile", { replace: true });
    }
  }, [currentUser, isPending, navigate]);

  return <div></div>;
}

export default App;
