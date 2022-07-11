import React from "react";
import axios from "axios";
import { addHours } from "date-fns";
import styled from "styled-components";
import { useLocation, useNavigate, NavigateFunction } from "react-router-dom";
import { NavBar } from "../../components/ui/NavBar/NavBar";
import { SocialLogin } from "../../components/ui/SocialLogin/SocialLogin";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  background-image: url("https://images.pexels.com/photos/1044990/pexels-photo-1044990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  background-repeat: no-repeat;
  background-size: cover;
`;

const Caption = styled.div`
  color: #fff;
`;
const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
`;

const getDeezerToken = async (code: string, navigate: NavigateFunction) => {
  try {
    const { data } = await axios.post("http://localhost:3001/api/auth/deezer", {
      token: code,
    });
    window.localStorage.setItem(
      "deezerToken",
      JSON.stringify({
        token: data.token,
        expires: addHours(new Date(), 24),
      })
    );
    window.localStorage.setItem(
      "deejaiToken",
      JSON.stringify({
        token: data.deejaiToken,
        expires: addHours(new Date(), 24),
      })
    );
    navigate("/rooms");
  } catch (err) {
    console.log(err);
  }
};
const getSpotifyToken = async (token: string, navigate: NavigateFunction) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.data.id) throw new Error("Authentication failed");
    const {
      id,
      product,
      country,
      images,
      type,
      uri,
      email,
      display_name
    } = response.data;
    const deejaiResponse = await axios.post("http://localhost:3001/api/auth/spotify", {
      id,
      product,
      country,
      picture: images[0].url,
      type,
      uri,
      email,
      display_name
    });
    const { deejaiToken } = deejaiResponse.data;

    window.localStorage.setItem(
      "spotifyToken",
      JSON.stringify({ token, expires: addHours(new Date(), 1) })
    );
    window.localStorage.setItem(
      "deejaiToken",
      JSON.stringify({
        token: deejaiToken,
        expires: addHours(new Date(), 1),
      })
    );
    navigate("/rooms");
  } catch (err) {
    console.log(err);
  }
};

const useQuery = async (navigate: NavigateFunction) => {
  const { hash, search } = useLocation();
  if (hash) {
    const token = hash.split("&")[0].split("=").at(1);
    if (token) await getSpotifyToken(token, navigate);
  }
  if (search) {
    const deezerToken = search.split("=").at(1);
    if (deezerToken) await getDeezerToken(deezerToken, navigate);
  }
  return React.useMemo(() => new URLSearchParams(hash), [hash]);
};

export const HomePage = () => {
  const navigate: NavigateFunction = useNavigate();
  useQuery(navigate);

  return (
    <Container>
      <NavBar logo={"https://i.ibb.co/7WyPN8Q/deejai-logo.png"} user={null} />
      <Content>
        <Caption>
          <Title>Simplifying your party</Title>
          <SubTitle>
            Invite people to your party and relax, we bring the songs.
          </SubTitle>
        </Caption>
        <SocialLogin title="Where’s your songs?" />
      </Content>
    </Container>
  );
};
