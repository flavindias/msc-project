import axios from "axios";
import { addHours } from "date-fns";
import { NavigateFunction } from "react-router-dom";
const { REACT_APP_API_URL } = process.env;

const getLocalToken = () =>
  JSON.parse(`${localStorage.getItem("deezerToken")}`);

export const getDeezerToken = async (
  code: string,
  navigate: NavigateFunction
) => {
  try {
    const { data } = await axios.post(`${REACT_APP_API_URL}/auth/deezer`, {
      token: code,
    });
    window.localStorage.setItem(
      "deezerToken",
      JSON.stringify({
        token: data.token,
        expires: addHours(new Date(), 24),
      })
    );
    window.localStorage.setItem(
      "deejaiToken",
      JSON.stringify({
        token: data.deejaiToken,
        expires: addHours(new Date(), 24),
      })
    );
    window.localStorage.setItem("platform", JSON.stringify({ name: "deezer" }));
    navigate("/rooms");
  } catch (err) {
    console.error(err);
  }
};
export const getTrackInfoByISRC = async (isrc: string) => {
  try {
    const stored = getLocalToken();
    const authenticated = JSON.parse(`${localStorage.getItem("deejaiToken")}`);
    const { data } = await axios.post(
      `${REACT_APP_API_URL}/deezer/isrc/${isrc}`,
      {
        access_token: stored.token,
      },
        {
          headers: {
            Authorization: `Bearer ${authenticated.token}`,
          },
        }
        
      
      
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
export const getRecommendations = async () => {
  try {
    const stored = getLocalToken();
    const authenticated = JSON.parse(`${localStorage.getItem("deejaiToken")}`);
    if (!stored) throw new Error("No token stored");
    await axios.get(
      `${REACT_APP_API_URL}/deezer/recommendation`,
      {
        headers: {
          Authorization: `Bearer ${authenticated.token}`,
        },
        params: {
          access_token: stored.token,
        },
      }
    );
  } catch (err) {
    console.error(err);
  }
};
