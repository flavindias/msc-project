import React, { useState, useRef } from "react";
import styled from "styled-components";
import { voteSong } from "../../../utils/deejai";

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
  /* display: {
    ${(props: { show: boolean }) => (props.show ? "none" : "flex")}
  } */
  width: 30%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: middle;
  height: 55px;
  align-items: flex-start;
  min-width: 55px;
`;
const DislikeIcon = styled.i`
  color: ${(props: { status: string }) =>
    props.status === "DISLIKE" ? "#f44336" : "#dadada"};
    &:hover {
      color: #fa6359c5;
    }
`;
const NewIcon = styled.i`
  color: ${(props: { status: string }) =>
    props.status === "NEUTRAL" ? "#FFD700" : "#dadada"};
    &:hover {
      color: #ebdfa0;
    }
`;
const LikeIcon = styled.i`
  color: ${(props: { status: string }) =>
    props.status === "LIKE" ? "#42abc3" : "#dadada"};
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
export const SongCard = (props: {
  isrc: string;
  id: string;
  name: string;
  status: string;
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
  const [playing, setPlaying] = useState(false);

  const audio = new Audio(
    props.deezerPreviewURL
      ? props.deezerPreviewURL
      : props.spotifyPreviewURL
      ? props.spotifyPreviewURL
      : ""
  );
  const audioRef = useRef(audio);

  const like = async () => {
    pause();
    await voteSong(props.id, "LIKE");
    props.voting();
  };
  const dislike = async () => {
    pause();
    await voteSong(props.id, "DISLIKE");
    props.voting();
  };

  const play = () => {
    setPlaying(true);
    audioRef.current.play();
  };

  const pause = () => {
    setPlaying(false);
    audioRef.current.pause();
  };
  const goToDeezer = () => {
    window.open(props.deezerLink, "_blank");
  }
  const goToSpotify = () => {
    window.open(props.spotifyLink, "_blank");
  }
  return (
    <CardBg>
      <TitleRow>
        <Title>{props.name}</Title>
        <ShareArea show={props.deejai}>
          <LikeIcon
            onClick={() => like()}
            status={props.status}
            className={"fas fa-thumbs-up"}
          />
          <NewIcon
            status={props.status}
            className={"fa-solid fa-certificate"}
          />
          <DislikeIcon
            onClick={() => dislike()}
            status={props.status}
            className={"fas fa-thumbs-down"}
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
