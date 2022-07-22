import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const CardBg = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* align-items: center;
    justify-content: center; */
  background: #ffffff;
  box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04),
    0px 0px 1px rgba(0, 0, 0, 0.04);
  border-radius: 8px;

  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.1),
      0px 2px 6px rgba(0, 0, 0, 0.08), 0px 0px 1px rgba(0, 0, 0, 0.08);
  }
`;
const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem;
  justify-content: space-between;
`;
const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #404040;
  vertical-align: middle;
`;

const ShareArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  vertical-align: middle;
`;
const UpdateInfo = styled.span`
  font-size: 0.8rem;
  font-weight: 400;
  color: #aeaeae;
  vertical-align: middle;
  margin-right: 1rem;
  font-style: italic;
`;
const ShareBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  vertical-align: middle;
  margin-right: 1rem;
`;
const ShareIcon = styled.i`
  color: #42abc3;
  margin-left: 5px;
`;
const ShareText = styled.span`
  font-size: 0.8rem;
  font-weight: 400;
  color: #aeaeae;
  vertical-align: middle;
  margin-left: 5px;
  font-style: italic;
`;
const DownloadIcon = styled.i`
  color: #42abc3;
  margin-left: 5px;
`;
const RoomId = styled.span`
  font-size: 0.5rem;
  font-weight: 300;
  color: #aeaeae;
`;

const ArtistsRow = styled.div`
  display: flex;
  padding: 1rem;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;
const ArtistElement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;
const ArtistImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  max-width: 50px;
  max-height: 50px;
`;
const ArtistName = styled.span`
  font-size: 0.5rem;
  font-weight: 300;
  color: #404040;
`;
const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;
const MembersArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 1rem;
`;

const OwnerImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: -10px;
`;
const MemberImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 1rem;
  margin-right: -10px;
`;

export const RoomCard = (props: {
  title: string;
  id: string;
  updatedAt: string;
  artists: {
    id: string;
    name: string;
    image: string;
  }[];
  owner: {
    id: string;
    name: string;
    image: string;
  };
  members: {
    id: string;
    name: string;
    image: string;
  }[];
}) => {
  const navigate = useNavigate();
  const showArtists = props.artists.slice(0, 6);
  const shareURL = () => {
    navigator.clipboard.writeText(`http://localhost:3000/rooms/${props.id}`);
    alert("URL successfully copied");
  };
  return (
    <CardBg onClick={() => navigate(`/rooms/${props.id}`)}>
      <TitleRow>
        <Title>{props.title}</Title>
        <ShareArea
          onClick={() => {
            shareURL();
          }}
        >
          <UpdateInfo>{`Updated ${
            new Date(props.updatedAt) &&
            formatDistanceToNow(new Date(props.updatedAt), { addSuffix: true })
          }`}</UpdateInfo>
          <ShareBox>
            <ShareIcon className="fa-solid fa-share-nodes" />
            <ShareText>Share</ShareText>
          </ShareBox>
          {/* <DownloadIcon className="fa-solid fa-cloud-arrow-down" /> */}
        </ShareArea>
      </TitleRow>
      <ArtistsRow>
        {showArtists.map((artist, index) => (
          <ArtistElement key={index}>
            <ArtistImage src={artist.image} alt={artist.name} />
            <ArtistName>{artist.name}</ArtistName>
          </ArtistElement>
        ))}
      </ArtistsRow>
      <CardFooter>
        <RoomId>{`#${props.id}`}</RoomId>
        <MembersArea>
          <OwnerImage src={props.owner.image} alt={props.owner.name} />
          {props.members.map((member, index) => (
            <MemberImage key={index} src={member.image} alt={member.name} />
          ))}
        </MembersArea>
      </CardFooter>
    </CardBg>
  );
};
