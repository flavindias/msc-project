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