import React from "react";
import styled from "styled-components";
import { NavBar } from "../../components/ui/NavBar/NavBar";
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: blue;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url("https://images.pexels.com/photos/1044990/pexels-photo-1044990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  background-repeat: no-repeat;
  background-size: cover;
`;

export const HomePage = () => {
  return (
    <Container>
      <NavBar logo={"https://i.ibb.co/7WyPN8Q/deejai-logo.png"} user={null} />
      <Content></Content>
    </Container>
  );
};
