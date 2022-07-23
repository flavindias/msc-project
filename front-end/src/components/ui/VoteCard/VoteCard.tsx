import React, { useState, useRef } from "react";
import styled from "styled-components";
import { voteSong } from "../../../utils/deejai";
import { useAnalyticsEventTracker } from "../../../utils/analytcs";

const CardBg = styled.div`
  width: 100%;
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
  margin: 1rem 0;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  max-height: 150px;
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
  height: 55px;
  line-height: 100%;
  font-size: inherit;
`;
const ShareArea = styled.div`
  display: flex;
  flex-direction: row;
  vertical-align: middle;
  height: 55px;
  align-items: flex-start;
`;
const VoteIcon = styled.i`
  color: "#42abc3";
  &:hover {
    color: #94d4d4;
  }
`;
const ISRC = styled.span`
  font-size: x-small;
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
  font-size: unset;
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
    props.deezerPreviewURL !== "" ? "#ef5466" : "#aeaeae"};
  margin-left: 5px;
`;

const PlayIcon = styled.i`
  color: #42abc3;
  margin-left: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: #1db954;
  }
`;


export const VoteCard = (props: {
  isrc: string;
  id: string;
  name: string;
  deezerPreviewURL: string;
  spotifyPreviewURL: string;
  deezerLink: string;
  spotifyLink: string;
  artists: {
    id: string;
    name: string;
    image: string;
  }[];
  deejai: boolean;
  voting: () => void;
}) => {
  const gaEventTracker = useAnalyticsEventTracker('Vote song');
  const [playing, setPlaying] = useState(false);

  const audio = new Audio(
    props.deezerPreviewURL
      ? props.deezerPreviewURL
      : props.spotifyPreviewURL
      ? props.spotifyPreviewURL
      : ""
  );
  
  const audioRef = useRef(audio);
  const vote = async () => {
    gaEventTracker("song_voted");
    pause();
    await voteSong(props.id, "LIKE");
    props.voting();
  };

  const play = () => {
    setPlaying(true);
    gaEventTracker("song_played");
    audioRef.current.play();
  };

  const pause = () => {
    setPlaying(false);
    gaEventTracker("song_paused");
    audioRef.current.pause();
  };
  const goToDeezer = () => {
    gaEventTracker("song_deejai_clicked");
    window.open(props.deezerLink, "_blank");
  }
  const goToSpotify = () => {
    gaEventTracker("song_spotify_clicked");
    window.open(props.spotifyLink, "_blank");
  }
  
  return (
    <CardBg>
      <TitleRow>
        <Title>{props.name}</Title>
        <ShareArea>
          <VoteIcon
            onClick={() => vote()}
            className={"fa-solid fa-plus"}
          />
        </ShareArea>
      </TitleRow>
      <ArtistsRow>
        {props.artists.map((artist, index) => (
          <ArtistElement key={index}>
            {/* <ArtistImage src={artist.image} /> */}
            <ArtistName>{artist.name}</ArtistName>
          </ArtistElement>
        ))}
      </ArtistsRow>
      <CardFooter>
        <ISRC>{`${props.isrc}`}</ISRC>
        <PlayIcon
          className={playing ? "fa-solid fa-pause" : "fas fa-play"}
          onClick={() => (playing ? pause() : play())}
        />
        <SpotifyIcon
          spotifyPreviewURL={props.spotifyPreviewURL}
          onClick={() => goToSpotify()}
          className={"fa-brands fa-spotify"}
        />
        <DeezerIcon
          deezerPreviewURL={props.deezerPreviewURL}
          onClick={() => goToDeezer()}
          className={"fa-brands fa-deezer"}
        />
      </CardFooter>
    </CardBg>
  );
};
