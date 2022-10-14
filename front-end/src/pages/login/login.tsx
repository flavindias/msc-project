import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate, NavigateFunction } from "react-router-dom";
import { NavBar } from "../../components/ui/NavBar/NavBar";
import { getDeezerToken } from "../../utils/deezer";
import { getSpotifyToken } from "../../utils/spotify";
import { Loader } from "../../components/ui/Loader/Loader";

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
interface stateType {
    from: { pathname: string | null }
  }
const useQuery = async (navigate: NavigateFunction) => {
  const location = useLocation();
  console.log(location, "login")
  // const state = location.state as stateType;
  // console.log("login", state);
  const { hash, search } = useLocation();
  if (hash) {
    const token = hash.split("&")[0].split("=").at(1);
    if (token) await getSpotifyToken(token, navigate, "/rooms");
  }
  if (search) {
    const deezerToken = search.split("=").at(1);
    if (deezerToken) await getDeezerToken(deezerToken, navigate, "/rooms");
  }
  return React.useMemo(() => new URLSearchParams(hash), [hash]);
};

export const Login = () => {
  const navigate: NavigateFunction = useNavigate();
  useQuery(navigate);

  return (
    <Container>
      <NavBar
        goToLogin={()=>{}}
        goHome={() => {}}
        goToRoom={() => {}}
        goToSongs={() => {}}
        logo={"https://i.ibb.co/7WyPN8Q/deejai-logo.png"}
        user={null}
      />
      <Content>
        <Loader isLoading={true} />
        
      </Content>
    </Container>
  );
};
