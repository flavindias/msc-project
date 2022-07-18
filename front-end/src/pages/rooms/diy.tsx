import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getDeejaiToken } from "../../utils/auth";
import { getTrackInfoByISRC } from "../../utils/deezer";
import { getTrackInfoByISRC as getTrackInfoByISRCSpotify } from "../../utils/spotify";
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
const RoomId = styled.span`
  font-size: 1rem;
  font-weight: 300;
  color: #70a9c7;
`;
const TitleText = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #70a9c7;
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
const SectionTitleText = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #444;
`;
const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
`;
const ProfileRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;
const ProfileElement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  max-width: 60px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  /* padding: 1rem; */
`;
const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
`;
const ProfileName = styled.span`
  font-size: 0.5rem;
  font-weight: 300;
  color: #404040;
  text-align: center;
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
export interface IUserResult {
  id: string;
  name: string;
  spotify: {
    picture: string;
  };
  deezer: {
    picture: string;
  };
}
export interface IArtistResult {
  id: string;
  picture: string;
  name: string;
}

export const RoomView = () => {
  const platform = JSON.parse(`${localStorage.getItem("platform")}`);
  const { id } = useParams();
  const [tracks, setTracks] = useState([]);
  const [onlyDeezer, setOnlyDeezer] = useState<string[]>([]);
  const [onlySpotify, setOnlySpotify] = useState<string[]>([]);
  const [users, setUsers] = useState<IUserResult[] | undefined>([]);
  const [owner, setOwner] = useState<IUserResult | undefined>(undefined);
  const [artists, setArtist] = useState<IArtistResult[] | undefined>(undefined);
  const [room, setRoom] = useState({
    id,
    name: "",
    isPrivate: false,
    deejai: false,
  });

  const findTrackInfo = async (isrc: string) => {
    if (platform.name === "spotify") {
      const trackInfo = await getTrackInfoByISRCSpotify(isrc);
      return trackInfo;
    }
    if (platform.name === "deezer") {
      const trackInfo = await getTrackInfoByISRC(isrc);
      return trackInfo;
    }
  };

  const fetchData = async () => {
    const response = await axios.get(`http://localhost:3001/api/rooms/${id}`, {
      headers: {
        Authorization: `Bearer ${getDeejaiToken().token}`,
      },
    });
    const { room } = response.data;
    const fetchedTracks = room.tracks.map(
      (trackInfo: {
        track: { deezer: any | null; isrc: string; spotify: any | null };
      }) => {
        return { ...trackInfo.track };
      }
    );
    const onlyDeezerTracks = fetchedTracks.filter(
      (track: { spotify: any }) => {
        return !track.spotify;
      }
    ).map((track: { isrc: string }) => track.isrc);
    const onlySpotifyTracks = fetchedTracks.filter(
      ( track: { deezer: any | null } ) => !track.deezer
    ).map((track: { isrc: string }) => track.isrc);
    const fetchedArtists = room.tracks
      .map((trackInfo: { track: any }) => trackInfo.track.artist)
      .filter(
        (v: { id: any }, i: any, a: { id: any }[]) =>
          a.findIndex((v2: { id: any }) => v2.id === v.id) === i
      );
    setTracks(fetchedTracks);
    setUsers(room.users.map((userInfo: { user: any }) => userInfo.user));
    setOwner(room.owner);
    setRoom(room);
    setArtist(fetchedArtists);
    setOnlyDeezer(onlyDeezerTracks);
    setOnlySpotify(onlySpotifyTracks);
  };
  useEffect(() => {
    async function fetchRoom() {
      await fetchData();
    }
    fetchRoom();
  }, []);
  if (platform.name === "deezer") {
    Promise.all(
      onlySpotify.map(async (isrc: string) => {
        await findTrackInfo(isrc);
      })
    );
  }
  if (platform.name === "spotify") {
    Promise.all(
      onlyDeezer.map(async (isrc: string) => {
        await findTrackInfo(isrc);
      })
    );
  }

  return (
    <Container>
      <TitleContainer>
        <TitleText>{`${room.name}`}</TitleText>
        <RoomId>{`#${room.id}`}</RoomId>
      </TitleContainer>
      <Content>
        <SectionTitleText>Members</SectionTitleText>
        <UsersContainer>
          <ProfileRow>
            <ProfileElement>
              <ProfileImage
                src={
                  owner &&
                  (owner.spotify
                    ? owner.spotify.picture
                    : owner.deezer
                    ? owner.deezer.picture
                    : "https://randomuser.me/api/portraits/men/8.jpg")
                }
              />
              <ProfileName>{`${owner && owner.name}`}</ProfileName>
            </ProfileElement>
            {users &&
              users.map((user) => (
                <ProfileElement key={user.id}>
                  <ProfileImage
                    src={
                      user.spotify
                        ? user.spotify.picture
                        : user.deezer
                        ? user.deezer.picture
                        : "https://randomuser.me/api/portraits/men/8.jpg"
                    }
                  />
                  <ProfileName>{`${user.name}`}</ProfileName>
                </ProfileElement>
              ))}
          </ProfileRow>
        </UsersContainer>
        <SectionTitleText>Artists</SectionTitleText>
        <UsersContainer>
          <ProfileRow>
            {artists &&
              artists.map((artist) => (
                <ProfileElement key={artist.id}>
                  <ProfileImage src={artist.picture} />
                  <ProfileName>{`${artist.name}`}</ProfileName>
                </ProfileElement>
              ))}
          </ProfileRow>
        </UsersContainer>
        <SectionTitleText>Songs</SectionTitleText>
        <RoomViewContainer>
          <SongContainer>
            {tracks.map(
              (song: {
                artist: { id: string; name: string; picture: string; };
                id: string;
                name: string;
                isrc: string;
                previewURL: string;
                deezer: { preview: string } | null;
                spotify: { previewUrl: string } | null;
              }) => {
                console.log(song);
                return (
                  <SongCard
                    voting={()=>{}}
                    deejai={room.deejai}
                    key={song.isrc}
                    deezerPreviewURL={song.deezer ? song.deezer.preview : ""}
                    spotifyPreviewURL={
                      song.spotify ? song.spotify.previewUrl : ""
                    }
                    name={song.name}
                    artists={[{id: song.artist.id, name: song.artist.name, image: song.artist.picture}]}
                    isrc={`${song.isrc}`}
                    status={"liked"}
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