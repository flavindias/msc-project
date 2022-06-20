import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { DEEZER_APP_ID, DEEZER_APP_SECRET } = process.env;

export const getToken = async (code: string) => {
    try {
        const response = await axios.get('https://connect.deezer.com/oauth/access_token.php', {
            params: {
                code,
                app_id: DEEZER_APP_ID,
                secret: DEEZER_APP_SECRET,
                output: 'json'
            }
        });
        return response.data.access_token;
    }
    catch(err){
        console.log(err);
    }
}

export const getTracks = async (token: string) => {
    try {
        console.log(token, "token");
        const response = await axios.get('https://api.deezer.com/user/me/tracks', {
            params: {
                access_token: token
            }
        });
        console.log(response.data, "getTracks");
        return response.data.data;
    }
    catch(err){
        console.log(err);
    }
}

export const getTrackInfo = async (id: string, accessToken: string) => {
  try {
    const response = await axios.get(
      `https://api.deezer.com/track/${id}`,
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    console.log("getTrackInfo", response.data);
  } catch (error) {
    console.log(error);
  }
};
export const getArtistInfo = () => {
  console.log("getArtistInfo");
};

export const getTrackByISRC = async (token: string, isrc: string) => {
    try {
        const response = await axios.get(`https://api.deezer.com/2.0/track/isrc:${isrc}`, {
            params: {
                access_token: token
            }
        });
        return response.data;
    }
    catch(err){
        console.log(err);
    }
}

export const getRecommendation = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://api.deezer.com/user/me/recommendations/tracks",
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    const trackArr  = response.data.data as RecommendationReturn[];
    
    trackArr.forEach(song => {
      getTrackInfo(`${song.id}`, accessToken);
    })
  } catch (err) {
    console.log(err);
  }
};

export interface RecommendationReturn {
  id: number,
    readable: boolean,
    title: string,
    duration:  number,
    rank: number ,
    explicit_lyrics: false,
    explicit_content_lyrics: number ,
    explicit_content_cover: number,
    md5_image: string,
    album: {
      id:  number,
      title: string,
      cover: string,
      cover_small: string,
      cover_medium: string,
      cover_big: string,
      cover_xl: string,
      md5_image: string,
      tracklist: string,
      type: string,
    },
    artist: {
      id:  number,
      name: string,
      picture: string,
      picture_small :string,
      picture_medium: string,
      picture_big: string,
      picture_xl: string,
      tracklist: string,
      type: string,
    },
    type: string,
  }