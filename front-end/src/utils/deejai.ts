import axios from "axios";
import { getDeejaiToken } from "./auth";
const { REACT_APP_API_URL } = process.env;

export const getRooms = async () => {
  try {
    const { data } = await axios.get(`${REACT_APP_API_URL}/rooms`, {
      headers: {
        Authorization: `Bearer ${getDeejaiToken().token}`,
      },
    });
    const rooms = data.map(
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
        const members = room.users.map((member) => member.user);

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
              : "https://via.placeholder.com/150",
          },
          members: members.map((member) => {
            return {
              id: member.id,
              name: member.name,
              image: member.spotify
                ? member.spotify.picture
                : member.deezer
                ? member.deezer.picture
                : "https://via.placeholder.com/150",
            };
          }),
        };
      }
    )
    return rooms;
  } catch (err) {
    console.error(err);
  }
};

export const getRoom = async (id: string) => {
  try {
    const response = await axios.get(
      `${REACT_APP_API_URL}/rooms/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getDeejaiToken().token}`,
        },
      }
    );
    const { room } = response.data;
    return room;
  }
  catch (err) {
    console.error(err);
  }
};

export const getSongs = async () => {
  try {
    const { data } = await axios.get(`${REACT_APP_API_URL}/tracks`, {
      headers: {
        Authorization: `Bearer ${getDeejaiToken().token}`,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const createRoom = async (name: string, deejai: boolean, durationValue: string) => {
  try {
    const nome = name === "" ? "Your room" : name;
    const duration = !isNaN(parseInt(durationValue)) ? durationValue : "60";
    const { data } = await axios.post(
      `${REACT_APP_API_URL}/rooms`,
      { name: nome, deejai, duration },
      {
        headers: {
          Authorization: `Bearer ${getDeejaiToken().token}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const joinRoom = async (id: string) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_API_URL}/rooms/${id}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getDeejaiToken().token}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const voteSong = async (trackId: string, vote: string) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_API_URL}/tracks/${trackId}/vote`,
      {
        vote,
      },
      {
        headers: {
          Authorization: `Bearer ${getDeejaiToken().token}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const addToPlaylist = async (rooomId: string, trackId: string) => {
  try {
    const { data } = await axios.post(
      `${REACT_APP_API_URL}/rooms/${rooomId}/track`,
      {
        trackId,
      },
      {
        headers: {
          Authorization: `Bearer ${getDeejaiToken().token}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
