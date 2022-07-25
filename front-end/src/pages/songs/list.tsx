import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getSongs } from "../../utils/deejai";
import { getTopTracks } from "../../utils/spotify";
import { getRecommendations } from "../../utils/deezer";
import { Loader } from "../../components/ui/Loader/Loader";
import { SongCard } from "../../components/ui/SongCard/SongCard";
import { useAnalyticsEventTracker } from "../../utils/analytcs";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  justify-content: center;
  align-items: center;
`;
const Content = styled.div`
  display: flex;
  width: 80%;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
const TitleText = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #70a9c7;
`;
const SubTitleText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #404040;
`;
const RoomViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  flex-wrap: wrap;
  ::after {
    content: "";
    flex: auto;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const SongContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 100%;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  flex-wrap: wrap;
  ::after {
    content: "";
    flex: auto;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
const SyncIcon = styled.i`
  font-size: 1.5rem;
  color: #70a9c7;
  margin-right: 1rem;
`;

const SyncButton = styled.div`
  background: #ffffff;
  border: 1px solid #70a9c7;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 300;
  color: #70a9c7;
  margin-right: 1rem;
  cursor: pointer;
  &:hover {
    background: #fafafa;
    color: #70a9c7;
  }
`;
const SyncText = styled.span`
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
  font-weight: 300;
  color: #70a9c7;
`;

export const SongList = () => {
  const gaEventTracker = useAnalyticsEventTracker("Song list");
  const [vote, setVote] = useState(false);
  const [newSongs, setNewSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);
  const [dislikeSongs, setDislikeSongs] = useState([]);

  const fetchSongs = async () => {
    const songList = await getSongs();
    const newSongList = songList
      .filter(
        (songItem: { vote: string; track: any }) => songItem.vote === "NEUTRAL"
      )
      .map((songItem: { vote: string; track: any }) => songItem.track);

    const likedSongList = songList
      .filter(
        (songItem: { vote: string; track: any }) => songItem.vote === "LIKE"
      )
      .map((songItem: { vote: string; track: any }) => songItem.track);
    const dislikeSongList = songList
      .filter(
        (songItem: { vote: string; track: any }) => songItem.vote === "DISLIKE"
      )
      .map((songItem: { vote: string; track: any }) => songItem.track);
    setNewSongs(newSongList);
    setLikedSongs(likedSongList);
    setDislikeSongs(dislikeSongList);
  };
  const sync = async () => {
    setIsLoading(true);
    gaEventTracker("song sync");
    const platform = JSON.parse(`${localStorage.getItem("platform")}`);

    if (platform.name === "deezer") {
      await getRecommendations();
    } else if (platform.name === "spotify") {
      await getTopTracks();
    }
    await fetchSongs();
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchSongs();
      setIsLoading(false);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (vote) {
      fetchSongs();
      setVote(false);
    }
  }, [vote]);

  const voting = () => {
    setVote(true);
  };

  return (
    <Container>
      <Content>
        <TitleContainer>
          <TitleText>My Songs</TitleText>
          <ActionsContainer>
            <SyncButton onClick={() => sync()}>
              <SyncIcon className="fa-solid fa-arrows-rotate" />
              <SyncText>Sync</SyncText>
            </SyncButton>
          </ActionsContainer>
        </TitleContainer>
        <RoomViewContainer>
          <SubTitleText>New Songs</SubTitleText>
          <SongContainer>
            {newSongs.map(
              (song: {
                artist: { id: string; name: string; picture: string };
                id: string;
                name: string;
                isrc: string;
                previewURL: string;
                deezer: { preview: string; link: string } | null;
                spotify: { previewUrl: string; uri: string } | null;
              }) => {
                return (
                  <SongCard
                    voting={voting}
                    deejai={false}
                    key={song.isrc}
                    deezerLink={song.deezer ? song.deezer.link : ""}
                    spotifyLink={song.spotify ? song.spotify.uri : ""}
                    deezerPreviewURL={song.deezer ? song.deezer.preview : ""}
                    spotifyPreviewURL={
                      song.spotify ? song.spotify.previewUrl : ""
                    }
                    name={song.name}
                    artists={[
                      {
                        id: song.artist.id,
                        name: song.artist.name,
                        image: song.artist.picture,
                      },
                    ]}
                    isrc={`${song.isrc}`}
                    status={"NEUTRAL"}
                    id={song.id}
                  />
                );
              }
            )}
          </SongContainer>
        </RoomViewContainer>
        <RoomViewContainer>
          <SubTitleText>Liked Songs</SubTitleText>
          <SongContainer>
            {likedSongs.map(
              (song: {
                artist: { id: string; name: string; picture: string };
                id: string;
                name: string;
                isrc: string;
                previewURL: string;
                deezer: { preview: string; link: string } | null;
                spotify: { previewUrl: string; uri: string } | null;
              }) => {
                return (
                  <SongCard
                    deejai={false}
                    voting={voting}
                    deezerLink={song.deezer ? song.deezer.link : ""}
                    spotifyLink={song.spotify ? song.spotify.uri : ""}
                    key={song.isrc}
                    deezerPreviewURL={song.deezer ? song.deezer.preview : ""}
                    spotifyPreviewURL={
                      song.spotify ? song.spotify.previewUrl : ""
                    }
                    name={song.name}
                    artists={[
                      {
                        id: song.artist.id,
                        name: song.artist.name,
                        image: song.artist.picture,
                      },
                    ]}
                    isrc={`${song.isrc}`}
                    status={"LIKE"}
                    id={song.id}
                  />
                );
              }
            )}
          </SongContainer>
        </RoomViewContainer>
        <RoomViewContainer>
          <SubTitleText>Disliked Songs</SubTitleText>
          <SongContainer>
            {dislikeSongs.map(
              (song: {
                artist: { id: string; name: string; picture: string };
                id: string;
                name: string;
                isrc: string;
                previewURL: string;
                deezer: { preview: string; link: string } | null;
                spotify: { previewUrl: string; uri: string } | null;
              }) => {
                return (
                  <SongCard
                    deejai={false}
                    voting={voting}
                    key={song.isrc}
                    deezerLink={song.deezer ? song.deezer.link : ""}
                    spotifyLink={song.spotify ? song.spotify.uri : ""}
                    deezerPreviewURL={song.deezer ? song.deezer.preview : ""}
                    spotifyPreviewURL={
                      song.spotify ? song.spotify.previewUrl : ""
                    }
                    name={song.name}
                    artists={[
                      {
                        id: song.artist.id,
                        name: song.artist.name,
                        image: song.artist.picture,
                      },
                    ]}
                    isrc={`${song.isrc}`}
                    status={"DISLIKE"}
                    id={song.id}
                  />
                );
              }
            )}
          </SongContainer>
        </RoomViewContainer>
      </Content>
      <Loader isLoading={isLoading} />
    </Container>
  );
};
