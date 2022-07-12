import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getDeejaiToken } from "../../utils/auth";
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
  margin-left: 1rem;
  margin-right: 1rem;
`;

const RoomViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  margin-top: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04),
    0px 0px 1px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  padding: 1rem;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const RoomView = () => {
  const { id } = useParams();
  const [room, setRoom] = useState({
    id,
    name: "",
    tracks: [],
    users: [],
    owner: {},
    isPrivate: false,
    deejai: false,
  });
  const fetchData = async () => {
    const response = await axios.get(`http://localhost:3001/api/rooms/${id}`, {
      headers: {
        Authorization: `Bearer ${getDeejaiToken().token}`,
      },
    });
    const { room } = response.data;
    setRoom(room);
  };
  useEffect(() => {
    async function fetchRoom() {
      await fetchData();
    }
    fetchRoom();
  }, []);
  console.log(room);
  return (
    <Container>
      <TitleContainer>
        <TitleText>{`Room #${id}`}</TitleText>
      </TitleContainer>
      <Content>
        <RoomViewContainer>{room.name}</RoomViewContainer>
      </Content>
    </Container>
  );
};
