import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { addToPlaylist } from "../../utils/deejai";
import { getSongs, getRoom } from "../../utils/deejai";
import { getTrackInfoByISRC } from "../../utils/deezer";
import { Loader } from "../../components/ui/Loader/Loader";
import { useAnalyticsEventTracker } from "../../utils/analytcs";
import { SongCard } from "../../components/ui/SongCard/SongCard";
import { VoteCard } from "../../components/ui/VoteCard/VoteCard";
import { ModalJoin } from "../../components/ui/ModalJoin/ModalJoin";
import { getTrackInfoByISRC as getTrackInfoByISRCSpotify } from "../../utils/spotify";
const { REACT_APP_APP_URL } = process.env;

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
  ::after {
    content: "";
    flex: auto;
  }
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
  ::after {
    content: "";
    flex: auto;
  }
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
  ::after {
    content: "";
    flex: auto;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CarrouselWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const Carrousel = styled.div`
  width: 90vw;
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  /* use this property to hide the scrollbar on firefox */
  /* scrollbar-width: none; */
  /* ::-webkit-scrollbar {
    display: none;
  } */
`;

const Item = styled.div`
  flex-basis: 20%;
  flex-shrink: 0;
  padding: 1rem;
  margin-right: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
const ShareIcon = styled.i`
  font-size: 1.5rem;
  color: #70a9c7;
  margin-right: 1rem;
`;

const ShareButton = styled.div`
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
const ShareText = styled.span`
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
  font-weight: 300;
  color: #70a9c7;
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

export interface ITrackResult {
  id: string;
  name: string;
  artist: IArtistResult;
  deezer: {
    preview: string;
    link: string;
  };
  spotify: {
    previewUrl: string;
    uri: string;
  };
  isrc: string;
}

export const RoomView = () => {
  const gaEventTracker = useAnalyticsEventTracker("Room view");

  const { id } = useParams();
  const [vote, setVote] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalJoin, setModalJoin] = useState(false);
  const [onlyDeezer, setOnlyDeezer] = useState<string[]>([]);
  const [onlySpotify, setOnlySpotify] = useState<string[]>([]);
  const [userSongs, setUserSongs] = useState<ITrackResult[]>([]);
  const [users, setUsers] = useState<IUserResult[] | undefined>([]);
  const platform = JSON.parse(`${localStorage.getItem("platform")}`);
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
    try {
      setIsLoading(true);
      const room = await getRoom(`${id}`);
      if (room.tracks) {
        const fetchedTracks = room.tracks.map(
          (trackInfo: {
            track: {
              deezer: any | null;
              isrc: string;
              spotify: any | null;
              evaluation: any | null;
            };
          }) => {
            return { ...trackInfo.track };
          }
        );
        const onlyDeezerTracks = fetchedTracks
          .filter((track: { spotify: any }) => {
            return !track.spotify;
          })
          .map((track: { isrc: string }) => track.isrc);
        const onlySpotifyTracks = fetchedTracks
          .filter((track: { deezer: any | null }) => !track.deezer)
          .map((track: { isrc: string }) => track.isrc);
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
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error(error, "error");
      // if (
      //   error.response &&
      //   error.response.status &&
      //   error.response.status === 403
      // )
      //   setModalJoin(true);
      setModalJoin(true);
      gaEventTracker("room join");
      // if (error.response.status === 403) {
      // }
    }
  };
  const fetchUserSongs = async () => {
    setIsLoading(true);
    const songList = await getSongs();
    setUserSongs(
      songList.map((songItem: { vote: string; track: any }) => songItem.track)
    );
    setIsLoading(false);
  };
  const voting = async (trackId: string) => {
    await addToPlaylist(`${room.id}`, trackId);
    await fetchData();
    setVote(true);
  };
  const votedForMe = async () => {
    await fetchData();
  };
  const toggleModal = () => {
    setModalJoin(!modalJoin);
  };
  const shareURL = async () => {
    await navigator.clipboard.writeText(`${REACT_APP_APP_URL}/rooms/${id}`);
    gaEventTracker("room share");
    alert("URL successfully copied");
  };
  useEffect(() => {
    async function fetchRoom() {
      await fetchData();
      if (!room.deejai) {
        await fetchUserSongs();
      }
    }
    fetchRoom();
  }, []);
  useEffect(() => {
    async function voting() {
      if (vote) {
        setIsLoading(true);
        await fetchData();
        setVote(true);
        setIsLoading(false);
      }
    }
    voting();
  }, [vote]);
  useEffect(() => {
    async function fetchUsers() {
      await fetchData();
    }
    fetchUsers();
  }, [modalJoin]);

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
        <ActionsContainer>
          <ShareButton onClick={() => shareURL()}>
            <ShareIcon className="fa-solid fa-share-nodes" />
            <ShareText>Share</ShareText>
          </ShareButton>
        </ActionsContainer>
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
                    : "https://via.placeholder.com/150")
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
                        : "https://via.placeholder.com/150"
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
                  <ProfileImage
                    src={
                      artist.picture
                        ? artist.picture
                        : "https://via.placeholder.com/150"
                    }
                  />
                  <ProfileName>{`${artist.name}`}</ProfileName>
                </ProfileElement>
              ))}
          </ProfileRow>
        </UsersContainer>
        {!room.deejai && <SectionTitleText>Deejai</SectionTitleText>}
        {!room.deejai && (
          <CarrouselWrapper>
            <Carrousel>
              {userSongs &&
                userSongs
                  .filter(
                    (track) =>
                      !tracks
                        .map((track: { id: string }) => track.id)
                        .includes(track.id)
                  )
                  .map((song) => (
                    <Item>
                      <VoteCard
                        voting={() => {
                          voting(song.id);
                        }}
                        deejai={true}
                        deezerLink={song.deezer ? song.deezer.link : ""}
                        spotifyLink={song.spotify ? song.spotify.uri : ""}
                        deezerPreviewURL={
                          song.deezer ? song.deezer.preview : ""
                        }
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
                        isrc={song.isrc}
                        id={song.id}
                      />
                      {/* <SongCard
                      voting={() => {}}
                      deejai={room.deejai}
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
                      status={"liked"}
                      id={song.id}
                    /> */}
                    </Item>
                  ))}
            </Carrousel>
          </CarrouselWrapper>
        )}
        <SectionTitleText>Songs</SectionTitleText>
        <RoomViewContainer>
          <SongContainer>
            {tracks.map(
              (song: {
                id: string;
                artist: { id: string; name: string; picture: string };
                name: string;
                isrc: string;
                previewURL: string;
                deezer: { preview: string; link: string } | null;
                spotify: { previewUrl: string; uri: string } | null;
                evaluation: { vote: string }[];
              }) => {
                return (
                  <SongCard
                    voting={votedForMe}
                    deejai={room.deejai}
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
                    status={
                      song.evaluation && song.evaluation.length !== 0
                        ? song.evaluation[0].vote
                        : "neutral"
                    }
                    id={song.id}
                  />
                );
              }
            )}
          </SongContainer>
        </RoomViewContainer>
      </Content>
      <ModalJoin
        toggleModal={() => toggleModal()}
        id={`${room.id}`}
        hide={!modalJoin}
      />
      <Loader isLoading={!modalJoin && isLoading} />
    </Container>
  );
};
