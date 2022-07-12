import axios from "axios";
import { addHours } from "date-fns";
import { NavigateFunction } from "react-router-dom";

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
    const deejaiResponse = await axios.post(
      "http://localhost:3001/api/auth/spotify",
      {
        id,
        product,
        country,
        picture: images[0].url,
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
    console.log(err);
  }
};

export const getTopTracks = async () => {
  try {
    const stored = JSON.parse(`${localStorage.getItem("spotifyToken")}`);
    const authenticated = JSON.parse(`${localStorage.getItem("deejaiToken")}`);
    if (!stored) throw new Error("No token stored");
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks`,
      {
        headers: {
          Authorization: `Bearer ${stored.token}`,
        },
        params: {
          limit: 50,
          offset: 0,
        },
      }
    );
    const { items } = response.data;
    if (items.length === 0) throw new Error("No tracks found");

    Promise.all(
      items.map(async (item: { external_ids: { isrc: string } }) => {
        await axios.post(
          "http://localhost:3001/api/spotify/sync",
          {
            isrc: item.external_ids.isrc,
            token: stored.token,
          },
          {
            headers: {
              Authorization: `Bearer ${authenticated.token}`,
            },
          }
        );
      })
    );
  } catch (err) {
    console.log(err);
  }
};
