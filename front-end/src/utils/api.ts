import axios from 'axios';

export default axios.create({
	// baseURL: 'http://localhost:3000/api',
	baseURL: 'https://api.plugow.pluvi.laceti.com.br/api'
});
