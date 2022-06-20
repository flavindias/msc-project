import axios from "axios";
import dotenv from "dotenv";
dotenv.config()


export const getTrackInfo = async () => {
    try {
        console.log('getTrackInfo');
        const data = await axios.get(`https://api.spotify.com/v1/me/top/tracks`);
        console.log(data.data);
    }
    catch (error) {
        console.log(error);
    }
};
export const getArtistInfo = () => {
    console.log('getArtistInfo');
};
export const getAudioFeatures = () => {
    console.log('getAudioFeatures');
};

export const getTrackByISRC = async (isrc: string, token: string) => {
    try {
        const data = await axios.get(`https://api.spotify.com/v1/search?type=track&q=isrc:${isrc}`, {
            headers: {
                Authorization: `Bearer ${token}`,
              },
        });
        console.log(data.data);
    }
    catch (error) {
        console.log(error);
    }
}