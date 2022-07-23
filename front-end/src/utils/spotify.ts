import axios from "axios";
import { addHours } from "date-fns";
import { NavigateFunction } from "react-router-dom";
const { REACT_APP_API_URL } = process.env;

const getLocalToken = () => JSON.parse(`${localStorage.getItem("spotifyToken")}`);
export const getSpotifyToken = async (
  token: string,
  navigate: NavigateFunction
) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.data.id) throw new Error("Authentication failed");
    const { id, product, country, images, type, uri, email, display_name } =
      response.data;
    let picture = "https://i.ibb.co/7WyPN8Q/deejai-logo.png";
    if (images.length > 0) picture = images[0].url;
    const deejaiResponse = await axios.post(
      `${REACT_APP_API_URL}/auth/spotify`,
      {
        id,
        product,
        country,
        picture,
        type,
        uri,
        email,
        display_name,
      }
    );
    const { deejaiToken } = deejaiResponse.data;

    window.localStorage.setItem(
      "spotifyToken",
      JSON.stringify({ token, expires: addHours(new Date(), 1) })
    );
    window.localStorage.setItem(
      "deejaiToken",
      JSON.stringify({
        token: deejaiToken,
        expires: addHours(new Date(), 1),
      })
    );
    window.localStorage.setItem(
      "platform",
      JSON.stringify({ name: "spotify" })
    );
    navigate("/rooms");
  } catch (err) {
    console.error(err);
  }
};

export const getTopTracks = async () => {
  try {
    const stored = getLocalToken();
    if (!stored) throw new Error("No token stored");
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks`,
      {
        headers: {
          Authorization: `Bearer ${stored.token}`,
        },
        params: {
          limit: 10,
          offset: 0,
        },
      }
    );
    const { items } = response.data;
    if (items.length === 0) throw new Error("No tracks found");

    Promise.all(
      items.map(async (item: { external_ids: { isrc: string } }) => {
        await getTrackInfoByISRC(item.external_ids.isrc);
      })
    );
  } catch (err) {
    console.error(err);
  }
};

export const getTrackInfoByISRC = async (isrc: string) => {
  try {
    const stored = getLocalToken();
    if (!stored) throw new Error("No token stored");
    const authenticated = JSON.parse(`${localStorage.getItem("deejaiToken")}`);
    if(!authenticated) throw new Error("No deejai token stored");
    await axios.post(
      `${REACT_APP_API_URL}/spotify/sync`,
      {
        isrc,
        token: stored.token,
      },
      {
        headers: {
          Authorization: `Bearer ${authenticated.token}`,
        },
      }
    );
  } catch (err) {
    console.error(err);
  }
}
