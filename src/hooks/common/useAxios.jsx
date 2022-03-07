import axios from 'axios';

export default function useAxios() {
	const instance = axios.create({
		timeout: 10000,
	});

	return instance;
}
