import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getSongs } from "../../utils/deejai";
import { SongCard } from "../../components/ui/SongCard/SongCard";
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
  width: 80%;
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
  @media (max-width: 768px) {
    width: 100%;
  }
`;
export const SongList = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [dislikeSongs, setDislikeSongs] = useState([]);
  const [newSongs, setNewSongs] = useState([]);
  const [vote, setVote] = useState(false);
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
  useEffect(() => {
    const fetchData = async () => {
      await fetchSongs();
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
    console.log("voting");
    setVote(true);
  };
  return (
    <Container>
      <Content>
        <TitleContainer>
          <TitleText>My Songs</TitleText>
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
                deezer: { preview: string } | null;
                spotify: { previewUrl: string } | null;
              }) => {
                return (
                  <SongCard
                    voting={voting}
                    deejai={false}
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
                deezer: { preview: string } | null;
                spotify: { previewUrl: string } | null;
              }) => {
                return (
                  <SongCard
                    deejai={false}
                    voting={voting}
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
                deezer: { preview: string } | null;
                spotify: { previewUrl: string } | null;
              }) => {
                return (
                  <SongCard
                    deejai={false}
                    voting={voting}
                    key={song.isrc}
                    deezerPreviewURL={song.deezer ? song.deezer.preview : ""}
                    spotifyPreviewURL={
                      song.spotify ? song.spotify.previewUrl : ""
                    }
                    name={song.name}
                    artists={
                      [
                        //   {
                        //     id: song.artist.id,
                        //     name: song.artist.name,
                        //     image: song.artist.picture,
                        //   },
                      ]
                    }
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
    </Container>
  );
};
