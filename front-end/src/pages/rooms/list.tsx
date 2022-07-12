import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { getDeejaiToken } from "../../utils/auth";
import { getRecommendations } from "../../utils/deezer";
import { getTopTracks } from "../../utils/spotify";
import { RoomCard } from "../../components/ui/RoomCard/RoomCard";

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
  margin-left: 1rem;
  margin-right: 1rem;
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

const FilterButton = styled.div`
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

const FilterText = styled.span`
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
  font-weight: 300;
  color: #70a9c7;
`;
const FilterIcon = styled.i`
  font-size: 1.5rem;
  color: #70a9c7;
  margin-right: 1rem;
`;

const sync = async () => {
  const platform = JSON.parse(`${localStorage.getItem("platform")}`);
  
  if (platform.name === "deezer") {
    await getRecommendations();
  }
  else if (platform.name === "spotify") {
    await getTopTracks();
  }
};

export const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const fetchRemoteRooms = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/rooms", {
        headers: {
          Authorization: `Bearer ${getDeejaiToken().token}`,
        },
      });

      setRooms(
        data.map(
          (room: {
            tracks: any;
            id: any;
            name: any;
            updatedAt: any;
            owner: {
              id: any;
              name: any;
              spotify: { picture: any };
              deezer: { picture: any };
            };
            users: {
              user: {
                id: string;
                name: string;
                spotify: { picture: string };
                deezer: { picture: string };
              };
            }[];
          }) => {
            const artists = room.tracks.map(
              (track: {
                track: { artist: { id: any; name: any; picture: any } };
              }) => {
                return {
                  id: track.track.artist.id,
                  name: track.track.artist.name,
                  image: track.track.artist.picture
                    ? track.track.artist.picture
                    : "https://via.placeholder.com/150",
                };
              }
            );
            const members = room.users.map((member) => member.user)
            
            return {
              id: room.id,
              name: room.name,
              updatedAt: room.updatedAt,
              artists,
              owner: {
                id: room.owner.id,
                name: room.owner.name,
                image: room.owner.spotify
                  ? room.owner.spotify.picture
                  : room.owner.deezer
                  ? room.owner.deezer.picture
                  : "https://randomuser.me/api/portraits/men/8.jpg",
              },
              members: members.map(
                (member) => {
                  console.log(member);
                  return {
                    id: member.id,
                    name: member.name,
                    image: member.spotify
                      ? member.spotify.picture
                      : member.deezer
                      ? member.deezer.picture
                      : "https://randomuser.me/api/portraits/men/8.jpg",
                  };
                }
              ),
            };
          }
        )
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    async function fetchRooms() {
      await fetchRemoteRooms();
    }
    fetchRooms();
  }, []);
  return (
    <Container>
      <TitleContainer>
        <TitleText>{"Rooms"}</TitleText>
        <ActionsContainer>
          <SyncButton onClick={() => sync()}>
            <SyncIcon className="fa-solid fa-arrows-rotate" />
            <SyncText>Sync</SyncText>
          </SyncButton>
          <FilterButton>
            <FilterIcon className="fa-solid fa-filter" />
            <FilterText>Filter</FilterText>
          </FilterButton>
        </ActionsContainer>
      </TitleContainer>
      <Content>
        {rooms.map((room) => {
          const { members, owner, name, id, updatedAt, artists } = room;
          return (
            <RoomCard
              key={id}
              artists={artists}
              members={members}
              owner={owner}
              title={name}
              id={id}
              updatedAt={updatedAt}
            />
          );
        })}
      </Content>
    </Container>
  );
};
