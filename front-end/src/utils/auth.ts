import API from './api';

export const isAuthenticated = () => {
	const token = localStorage.getItem('deejai-token');
	if (token) {
		return true;
	}
	return false;
};

export const getToken = () => {
	const token = localStorage.getItem('deejai-token');
	if (token) {
		return token;
	}
	return null;
};

export const getUser = () => {
	const token = getToken();
	if (token) {
		return API.get('/me');
	}
};


