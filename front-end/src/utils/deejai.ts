import axios from "axios";
import { getDeejaiToken } from "./auth";

export const getSongs = async () => {
  try {
    const { data } = await axios.get("http://localhost:3001/api/tracks", {
      headers: {
        Authorization: `Bearer ${getDeejaiToken().token}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createRoom = async (name: string, deejai: boolean) => {
  try {
    const nome = name === "" ? "Your room" : name;
    const { data } = await axios.post(
      "http://localhost:3001/api/rooms",
      { name: nome, deejai },
      {
        headers: {
          Authorization: `Bearer ${getDeejaiToken().token}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}

export const joinRoom = async (id: string) => {
  try {
    const { data } = await axios.post(
      `http://localhost:3001/api/rooms/${id}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getDeejaiToken().token}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}


export const voteSong = async (trackId: string, vote: string) => {
  try {
    const { data } = await axios.post(
      `http://localhost:3001/api/tracks/${trackId}/vote`,
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
    console.log(err);
  }
};

export const addToPlaylist = async (rooomId: string, trackId: string) => {
  try {
    const { data } = await axios.post(
      `http://localhost:3001/api/rooms/${rooomId}/track`,
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
    console.log(err);
  }
}
