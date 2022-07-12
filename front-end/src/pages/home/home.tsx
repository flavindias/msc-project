import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate, NavigateFunction } from "react-router-dom";
import { NavBar } from "../../components/ui/NavBar/NavBar";
import { SocialLogin } from "../../components/ui/SocialLogin/SocialLogin";
import { getDeezerToken } from "../../utils/deezer";
import { getSpotifyToken } from "../../utils/spotify";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("https://images.pexels.com/photos/1044990/pexels-photo-1044990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  background-repeat: no-repeat;
  background-size: cover;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Content = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Caption = styled.div`
  color: #fff;
  @media (max-width: 768px) {
    width: 80%;
    text-align: center;
  }
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




const useQuery = async (navigate: NavigateFunction) => {
  const { hash, search } = useLocation();
  if (hash) {
    const token = hash.split("&")[0].split("=").at(1);
    if (token) await getSpotifyToken(token, navigate);
  }
  if (search) {
    const deezerToken = search.split("=").at(1);
    if (deezerToken) await getDeezerToken(deezerToken, navigate);
  }
  return React.useMemo(() => new URLSearchParams(hash), [hash]);
};

export const HomePage = () => {
  const navigate: NavigateFunction = useNavigate();
  useQuery(navigate);

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
        <SocialLogin title="Where’s your songs?" />
      </Content>
    </Container>
  );
};
