import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import ReactGA from "react-ga4";
import styled from "styled-components";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { HomePage } from "./pages/home/home";
import { NavBar } from "./components/ui/NavBar/NavBar";
import { RoomList } from "./pages/rooms/list";
import { RoomView } from "./pages/rooms/view";
import { SongList } from "./pages/songs/list";
import { Login } from "./pages/login/login";
import { isAuthenticated, getUser } from "./utils/auth";

const {REACT_APP_TRACK_ID} = process.env;
ReactGA.initialize(`${REACT_APP_TRACK_ID}`);
const AppContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const routes = {
  home: "/",
  dashboard: "/dashboard",
  login: "/login",
  rooms: "/rooms",
  room: "/rooms/:id",
  songs: "/songs",
};

const WithNavLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  const [user, setUser] = useState({
    name: "",
    player: "",
    photo: "",
  });
  const goToLogin = () => {
    navigate("/");
  };
  const goToHome = () => {
    navigate("/rooms");
  };
  const goToSongs = () => {
    navigate("/songs");
  };
  const goToRooms = () => {
    navigate("/rooms");
  };
  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      if (user) setUser(user);
    }
    fetchUser();
  }, [authenticated]);

  if (!authenticated) {
    return <Navigate to={routes.home} replace state={{
      from: location
    }}/>;
  } else {
    return (
      <AppContainer>
        <NavBar
          goToLogin={() => goToLogin()}
          goToRoom={() => goToRooms()}
          goToSongs={() => goToSongs()}
          goHome={() => goToHome()}
          logo={"https://i.ibb.co/7WyPN8Q/deejai-logo.png"}
          user={user}
        />
        <Outlet />
      </AppContainer>
    );
  }
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path={routes.login} element={<Login />} />
      <Route element={<WithNavLayout />}>
        <Route path={routes.rooms} element={<RoomList />} />
        <Route path={routes.room} element={<RoomView />} />
        <Route path={routes.songs} element={<SongList />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
