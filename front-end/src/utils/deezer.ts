import axios from "axios";
import { addHours } from "date-fns";
import { NavigateFunction } from "react-router-dom";

export const getDeezerToken = async (code: string, navigate: NavigateFunction) => {
  try {
    const { data } = await axios.post("http://localhost:3001/api/auth/deezer", {
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
    window.localStorage.setItem(
      "platform",
      JSON.stringify({name: "deezer"})
    );
    navigate("/rooms");
  } catch (err) {
    console.log(err);
  }
};

export const getRecommendations = async () => {
  try {
    const stored = JSON.parse(`${localStorage.getItem("deezerToken")}`);
    const authenticated = JSON.parse(`${localStorage.getItem("deejaiToken")}`);
    if (!stored) throw new Error("No token stored");
    console.log(authenticated.token, "stored");
    const response = await axios.get(
      "http://localhost:3001/api/deezer/recommendation",
      {
        headers: {
            Authorization: `Bearer ${authenticated.token}`
        },
        params: {
          access_token: stored.token,
        },
      }
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};
