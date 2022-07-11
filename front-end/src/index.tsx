import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from "react-dom/client";
import styled from "styled-components";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { HomePage } from "./pages/home/home";
import { NavBar } from "./components/ui/NavBar/NavBar";
import { RoomList } from "./pages/rooms/list";
import { isAuthenticated, getDeejaiToken } from "./utils/auth";

const AppContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const routes = {
  dashboard: "/dashboard",
  login: "/login",
  rooms: "/rooms",
  room: "/rooms/:id",
};

const getUser = async () => {
  try {
    
    const { data } = await axios.get("http://localhost:3001/api/auth/me", {
      headers: {
        Authorization: `Bearer ${getDeejaiToken().token}`,
      },
    });
    const { user } = data;
    const userData = {
      name: user.name,
      player: user.email,
      photo: user.spotify
        ? user.spotify.picture
        : user.deezer
        ? user.deezer.picture
        : "https://randomuser.me/api/portraits/men/8.jpg",
    };
    return userData;
  } catch (err) {
    console.log(err);
  }
};

const WithNavLayout = () => {
  const authenticated = isAuthenticated();
  const [user, setUser] = useState({
    name: "Pedro Dias",
    player: "My Player Name",
    photo: "https://randomuser.me/api/portraits/men/7.jpg",
  });
  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      if (user) setUser(user);
    }
    fetchUser();
  }, [authenticated]);

  if (!authenticated) {
    return <Navigate to={routes.login} />;
  } else {
    return (
      <AppContainer>
        <NavBar logo={"https://i.ibb.co/7WyPN8Q/deejai-logo.png"} user={user} />
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
      <Route path={routes.login} element={<HomePage />} />
      <Route element={<WithNavLayout />}>
        <Route path={routes.rooms} element={<RoomList />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
