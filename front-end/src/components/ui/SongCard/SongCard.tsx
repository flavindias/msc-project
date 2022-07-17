import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const CardBg = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* align-items: center;
    justify-content: center; */
  background: #ffffff;
  box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04),
    0px 0px 1px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.1),
      0px 2px 6px rgba(0, 0, 0, 0.08), 0px 0px 1px rgba(0, 0, 0, 0.08);
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
`;
const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;
const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #404040;
  vertical-align: middle;
`;
const ShareArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  vertical-align: middle;
`;
const ReactionIcon = styled.i`
  color: #42abc3;
  margin-left: 5px;
`;
const ISRC = styled.span`
  font-size: 0.75rem;
  font-weight: 300;
  color: #aeaeae;
`;

const ArtistsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 1rem;
`;
const ArtistElement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;
const ArtistImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
`;
const ArtistName = styled.span`
  font-size: 1rem;
  font-weight: 300;
  color: #404040;
`;
const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;
const SpotifyIcon = styled.i`
  color: ${(props: { spotifyPreviewURL: string }) =>
    props.spotifyPreviewURL !== "" ? "#1db954" : "#aeaeae"};
  margin-left: 5px;
`;

const DeezerIcon = styled.i`
  color: ${(props: { deezerPreviewURL: string }) =>
    props.deezerPreviewURL !== "" ? "#00c7f2" : "#aeaeae"};
  margin-left: 5px;
`;

export const SongCard = (props: {
  isrc: string;
  id: string;
  name: string;
  status: string;
  deezerPreviewURL: string;
  spotifyPreviewURL: string;
  artists: {
    id: string;
    name: string;
    image: string;
  }[];
}) => {
  const [playing, setPlaying] = useState(false);
  
  const audio = new Audio(
    props.deezerPreviewURL
      ? props.deezerPreviewURL
      : props.spotifyPreviewURL
      ? props.spotifyPreviewURL
      : ""
  );
  const audioRef = useRef(audio);

  const play = () => {
    setPlaying(true);
    audioRef.current.play();
  };

  const pause = () => {
    setPlaying(false);
    audioRef.current.pause();
  };
  return (
    <CardBg>
      <TitleRow>
        <Title>{props.name}</Title>
        <ShareArea>
          <ReactionIcon
            className={
              props.status === "liked"
                ? "fas fa-thumbs-up"
                : props.status === "disliked"
                ? "fas fa-thumbs-down"
                : "fa-solid fa-certificate"
            }
            style={
              props.status === "liked"
                ? { color: "#42abc3" }
                : props.status === "disliked"
                ? { color: "#f44336" }
                : { color: "#FFD700" }
            }
          />
        </ShareArea>
      </TitleRow>
      <ArtistsRow>
        {props.artists.map((artist, index) => (
          <ArtistElement key={index}>
            <ArtistImage src={artist.image} />
            <ArtistName>{artist.name}</ArtistName>
          </ArtistElement>
        ))}
      </ArtistsRow>
      <CardFooter>
        <ISRC>{`${props.isrc}`}</ISRC>
        <SpotifyIcon
          spotifyPreviewURL={props.spotifyPreviewURL}
          onClick={() => (playing ? pause() : play())}
          className={"fa-brands fa-spotify"}
        />
        <DeezerIcon
          deezerPreviewURL={props.deezerPreviewURL}
          onClick={() => {
            playing ? pause() : play();
          }}
          className={"fa-brands fa-deezer"}
        />
      </CardFooter>
    </CardBg>
  );
};
