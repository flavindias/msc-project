import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04),
    0px 0px 1px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  background-color: white;
  padding: 1rem;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  background-color: #00c7f2;
  border-radius: 8px;
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
export const SocialLogin = (props: { title: string, spotifyLogin: Function }) => {
  return (
    <CardContainer>
      <CardTitle>{props.title}</CardTitle>
      <StreammingRow>
        <StreamingElement>
          <SpotifyContainer>
            <SpotifyIcon className="fa-brands fa-spotify" />
            <SpotifyTitle>{"Spotify"}</SpotifyTitle>
          </SpotifyContainer>
          <DeezerContainer>
            <DeezerIcon className="fa-brands fa-deezer" />
            <DeezerTitle>{"Deezer"}</DeezerTitle>
          </DeezerContainer>
        </StreamingElement>
      </StreammingRow>
    </CardContainer>
  );
};
