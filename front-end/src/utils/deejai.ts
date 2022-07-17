import axios from "axios";
import { addHours } from "date-fns";
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
