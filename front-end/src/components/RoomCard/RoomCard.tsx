import React from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns'

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
    padding: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
        box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.1), 0px 2px 6px rgba(0, 0, 0, 0.08),
            0px 0px 1px rgba(0, 0, 0, 0.08);
    }
`;
const TitleRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
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
    color: #AEAEAE;
    vertical-align: middle;
    margin-right: 1rem;
    font-style: italic;
`;
const ShareIcon = styled.i`
    color: #42ABC3;
    margin-left: 5px;
    `;
const DownloadIcon = styled.i`
    color: #42ABC3;
    margin-left: 5px;
    `;
const RoomId = styled.span`
    font-size: 0.5rem;
    font-weight: 300;
    color: #AEAEAE;
`;

const ArtistsRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 1rem;
`;
const ArtistElement = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
`;
const ArtistImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 0.5rem;
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
    margin-bottom: 1rem;
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
    title: string,
    id: string,
    updatedAt: string,
    artists: {
        id: string,
        name: string,
        image: string,
    }[],
    owner:{
        id: string,
        name: string,
        image: string,
    },
    members: {
        id: string,
        name: string,
        image: string,
    }[],
}) => {
    return (
        <CardBg>
            <TitleRow>
                <Title>{props.title}</Title>
                <ShareArea>
                <UpdateInfo>{`Updated ${new Date(props.updatedAt) && formatDistanceToNow(new Date(props.updatedAt), { addSuffix: true})}`}</UpdateInfo>
                    <ShareIcon className="fa-solid fa-share" />
                    <DownloadIcon className="fa-solid fa-cloud-arrow-down" />
                </ShareArea>

            </TitleRow>
            <ArtistsRow>
                {props.artists.map((artist, index) => (
                    <ArtistElement key={index}>
                        <ArtistImage src={artist.image}/>
                        <ArtistName>{artist.name}</ArtistName>
                    </ArtistElement>
                ))}
            </ArtistsRow>
            <CardFooter>
            <RoomId>{`#${props.id}`}</RoomId>
            <MembersArea>
                <OwnerImage src={props.owner.image} />
                {props.members.map((member, index) => (
                    <MemberImage key={index} src={member.image} />
                ))}
            </MembersArea>
            </CardFooter>
        </CardBg>
    );
}
