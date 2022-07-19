import React from "react";
import styled from "styled-components";
const NavContainer = styled.header`
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04),
    0px 0px 1px rgba(0, 0, 0, 0.04);
`;
const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-left: 1rem;
  @media (max-width: 768px) {
    margin-left: 0%;
  }
`;
const LogoImage = styled.img`
  height: 100px;
  width: auto;
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 1rem;
`;
const ProfileImage = styled.img`
  height: 40px;
  width: auto;
  border-radius: 50%;
  background: #faa;
  @media (max-width: 768px) {
    height: 25px;
  }
`;
const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-right: 1rem;
`;

const Name = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #404040;
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;
const Role = styled.span`
  font-size: 0.8rem;
  font-weight: 300;
  color: #aeaeae;
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;
const NavLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const NavLink = styled.span`
  text-decoration: none;
  color: #aeaeae;
  padding: 1rem;
  &:hover {
    background: #aeaeae;
    color: #fff;
  }
  @media (max-width: 768px) {
    padding: 0.3rem;
  }
`;
const logout = () => {
  localStorage.removeItem("deezerToken");
  localStorage.removeItem("spotifyToken");
  localStorage.removeItem("deejaiToken");
  localStorage.removeItem("platform");
  window.location.reload();
};

export const NavBar = (props: {
  logo: string;
  user: {
    name: string;
    player: string;
    photo: string;
  } | null;
  goHome: () => void;
  goToRoom: () => void;
  goToSongs: () => void;
  goToLogin: () => void;
}) => {
  const goHome = () => {
    props.goHome();
  };
  const goToRooms = () => {
    props.goToRoom();
  };
  const goToSongs = () => {
    props.goToSongs();
  };
  console.log(props.user);
  if (props.user && props.user.player === "") {
    console.log("user is null");
    props.goToLogin();
  }
  if (!props.user) {
    console.log("user is null");
    props.goToLogin();
  }
  return (
    <NavContainer>
      <LogoContainer>
        <LogoImage onClick={() => goHome()} src={props.logo} alt="logo" />
      </LogoContainer>
      {props.user && (
        <NavLinkContainer>
          <NavLink onClick={() => goToRooms()}>Rooms</NavLink>
          <NavLink onClick={() => goToSongs()}>Songs</NavLink>
        </NavLinkContainer>
      )}
      {props.user && (
        <UserContainer onClick={() => logout()}>
          <NameContainer>
            <Name>{props.user.name}</Name>
            <Role>{props.user.player}</Role>
          </NameContainer>
          <ProfileImage src={props.user.photo} alt="user" />
        </UserContainer>
      )}
    </NavContainer>
  );
};
