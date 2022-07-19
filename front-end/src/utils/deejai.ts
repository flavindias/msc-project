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
    const { data } = await axios.post(
      "http://localhost:3001/api/rooms",
      { name, deejai },
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
