import axios from "axios";

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
	  const { data } = await axios.get("http://localhost:3001/api/auth/me", {
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
		  : "https://randomuser.me/api/portraits/men/8.jpg",
	  };
	  return userData;
	} catch (err) {
	  console.log(err);
	}
  };