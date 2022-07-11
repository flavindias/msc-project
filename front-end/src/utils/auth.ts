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

export const getUser = () => {
	const token = getToken();
	if (token) {
		// return API.get('/me');
	}
};



export const getDeejaiToken = () => {
	return JSON.parse(`${localStorage.getItem("deejaiToken")}`)
};