import axios from "axios";
const { REACT_APP_API_URL } = process.env;

export const isAuthenticated = () => {
	const spotifyToken = localStorage.getItem('spotifyToken');
	const deezerToken = localStorage.getItem('deezerToken');
	if (deezerToken || spotifyToken) {
		return true;
	}
	return false;
};

export const getToken = () => {
	const deejaiToken = localStorage.getItem('deejaiToken');
	if (deejaiToken) {
		return deejaiToken;
	}
	return null;
};


export const getPlatform = () => {
	return JSON.parse(`${localStorage.getItem("platform")}`);
};

export const getDeejaiToken = () => {
	return JSON.parse(`${localStorage.getItem("deejaiToken")}`)
};

export const getUser = async () => {
	try {
	  const { data } = await axios.get(`${REACT_APP_API_URL}/auth/me`, {
		headers: {
		  Authorization: `Bearer ${getDeejaiToken().token}`,
		},
	  });
	  const { user } = data;
	  const userData = {
		name: user.name,
		player: `${getPlatform().name} - logout`,
		photo: user.spotify
		  ? user.spotify.picture
		  : user.deezer
		  ? user.deezer.picture
		  : "https://via.placeholder.com/150",
	  };
	  return userData;
	} catch (err) {
	  console.error(err);
	}
  };