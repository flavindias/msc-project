import React from "react";
import styled from "styled-components";
import { NavBar } from "../../components/ui/NavBar/NavBar";
import { SocialLogin } from "../../components/ui/SocialLogin/SocialLogin";
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  background-image: url("https://images.pexels.com/photos/1044990/pexels-photo-1044990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  background-repeat: no-repeat;
  background-size: cover;
`;

const Caption = styled.div`
  color: #fff;
`;
const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
`;

const spotifyLogin = () => {
  console.log("spotifyLogin");
}
const deezerLogin = () => {
  console.log("deezerLogin");
}

export const HomePage = () => {
  return (
    <Container>
      <NavBar logo={"https://i.ibb.co/7WyPN8Q/deejai-logo.png"} user={null} />
      <Content>
        <Caption>
          <Title>Simplifying your party</Title>
          <SubTitle>
            Invite people to your party and relax, we bring the songs.
          </SubTitle>
        </Caption>
        <SocialLogin title="Where’s your songs?"  />
      </Content>
    </Container>
  );
};
