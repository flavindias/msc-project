import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getTopTracks } from "../../utils/spotify";
import { getRecommendations } from "../../utils/deezer";
import { Modal } from "../../components/ui/Modal/Modal";
import { createRoom, getRooms } from "../../utils/deejai";
import { Loader } from "../../components/ui/Loader/Loader";
import { RoomCard } from "../../components/ui/RoomCard/RoomCard";
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
const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  } else if (platform.name === "spotify") {
    await getTopTracks();
  }
};
const createNewRoom = async (
  name: string,
  deejai: boolean,
  durationValue: string
) => {
  await createRoom(name, deejai, durationValue);
};
export const RoomList = () => {
  const gaEventTracker = useAnalyticsEventTracker("Room list");
  const [showModalCreateRoom, setShowModalCreateRoom] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchRemoteRooms = async () => {
    try {
      setIsLoading(true);
      const rooms = await getRooms();
      setRooms(rooms);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    async function fetchRooms() {
      setIsLoading(true);
      await fetchRemoteRooms();
      sync();
      setIsLoading(false);
    }
    fetchRooms();
  }, []);
  const newRoom = async (name: string, deejai: boolean, duration: string) => {
    await createNewRoom(name, deejai, duration);
    toggleModal();
    gaEventTracker("create room");
    await fetchRemoteRooms();
  };
  const toggleModal = () => {
    setShowModalCreateRoom(!showModalCreateRoom);
  };
  return (
    <Container>
      <Content>
        <TitleContainer>
          <TitleText>{"Rooms"}</TitleText>
          <ActionsContainer>
            <FilterButton onClick={() => toggleModal()}>
              <FilterIcon className="fa-solid fa-plus" />
              <FilterText>Create</FilterText>
            </FilterButton>
          </ActionsContainer>
        </TitleContainer>

        <RoomViewContainer>
          <RoomContainer>
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
          </RoomContainer>
        </RoomViewContainer>
      </Content>
      <Modal
        toggleModal={() => toggleModal()}
        createRoomFn={(name, deejai, duration) =>
          newRoom(name, deejai, duration)
        }
        hide={showModalCreateRoom}
      />
      <Loader isLoading={isLoading} />
    </Container>
  );
};
