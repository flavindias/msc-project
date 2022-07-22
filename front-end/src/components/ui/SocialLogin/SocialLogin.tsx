import React from "react";
import styled from "styled-components";
const {
  REACT_APP_SPOTIFY_REDIRECT_URL,
  REACT_APP_SPOTIFY_CLIENT_ID,
  REACT_APP_SPOTIFY_SCOPE,
  REACT_APP_DEEZER_APP_ID,
  REACT_APP_DEEZER_REDIRECT_URL,
  REACT_APP_DEEZER_APP_PERMISSIONS,
} = process.env;
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04),
    0px 0px 1px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  background-color: white;
  padding: 1rem;
  @media (max-width: 768px) {
    width: 80%;
    flex-direction: column;
  }
`;

const CardTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #000000;
  text-align: center;
  margin-bottom: 1rem;
`;

const StreammingRow = styled.div`
  margin-bottom: 1rem;
  align-items: center;
  justify-content: space-evenly;
`;
const StreamingElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;
const SpotifyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  background-color: #1db954;
  border-radius: 8px;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const SpotifyIcon = styled.i`
  color: #fff;
  margin-right: 1rem;
  margin-left: 1rem;
  font-size: 1.5rem;
`;
const SpotifyTitle = styled.h1`
  font-size: 1.5rem;
  color: #fff;
  text-align: center;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
`;
const DeezerContainer = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  background-color: #00c7f2;
  border-radius: 8px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const DeezerIcon = styled.i`
  color: #fff;
  margin-right: 1rem;
  margin-left: 1rem;
  font-size: 1.5rem;
`;
const DeezerTitle = styled.h1`
  font-size: 1.5rem;
  color: #fff;
  text-align: center;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
`;

const spotifyLogin = () => {
  const client_id = `${REACT_APP_SPOTIFY_CLIENT_ID}`;
  const redirect_uri = `${REACT_APP_SPOTIFY_REDIRECT_URL}`;
  const scope = `${REACT_APP_SPOTIFY_SCOPE}`;
  const response_type = "token";
  const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;
  window.location.href = url;
};

const deezerLogin = () => {
  const app_id = `${REACT_APP_DEEZER_APP_ID}`;
  const redirect_uri = `${REACT_APP_DEEZER_REDIRECT_URL}`;
  const permissions = `${REACT_APP_DEEZER_APP_PERMISSIONS}`;
  const url = `https://connect.deezer.com/oauth/auth.php?app_id=${app_id}&redirect_uri=${redirect_uri}&perms=${permissions}`;
  window.location.href = url;
};
export const SocialLogin = (props: { title: string }) => {
  return (
    <CardContainer>
      <CardTitle>{props.title}</CardTitle>
      <StreammingRow>
        <StreamingElement>
          <SpotifyContainer onClick={() => spotifyLogin()}>
            <SpotifyIcon className="fa-brands fa-spotify" />
            <SpotifyTitle>{"Spotify"}</SpotifyTitle>
          </SpotifyContainer>
          <DeezerContainer onClick={() => deezerLogin()}>
            <DeezerIcon className="fa-brands fa-deezer" />
            <DeezerTitle>{"Deezer"}</DeezerTitle>
          </DeezerContainer>
        </StreamingElement>
      </StreammingRow>
    </CardContainer>
  );
};
