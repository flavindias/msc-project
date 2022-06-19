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
