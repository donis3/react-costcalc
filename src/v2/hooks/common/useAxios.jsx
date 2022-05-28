import { useEffect, useState } from 'react';
import axios from 'axios';

//Axios Configuration
const axiosOptions = {
	timeout: 10000,
};

/**
 * Will fetch given url onLoad. Manual fetch also supported
 * @param {object} param0 url optional
 * @returns error loading data fetchUrl()
 */
export default function useAxios({ url = null } = {}) {
	//States
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	/**
	 * Auto Fetch if a url param is provided with the hook
	 */
	useEffect(() => {
		//IF a url string is provided, start fetching
		if (!url || typeof url !== 'string' || url.length < 1) return;
		//Set loading to true
		setLoading(true);
		//Start fetching
		axios
			.get(url, axiosOptions)
			.then((response) => {
				//Got a response
				if (response.status > 200 && response.status < 300 && response.data) {
					//Got data
					setData(response.data);
				} else {
					throw new Error('Unable to fetch data from address. ' + url);
				}
			})
			.catch((err) => {
				//Catch error
				setError(err);
			})
			.finally(() => {
				//Stop loading state
				setLoading(false);
			});
	}, [url]);

	const fetchUrl = ({ url = null } = {}) => {
		//IF a url string is provided, start fetching
		if (!url || typeof url !== 'string' || url.length < 1) return;
		//Set loading to true
		setLoading(true);
		//Start fetching
		axios
			.get(url, axiosOptions)
			.then((response) => {
				//Got a response
				if (response.status > 200 && response.status < 300 && response.data) {
					//Got data
					setData(response.data);
				} else {
					throw new Error('Unable to fetch data from address. ' + url);
				}
			})
			.catch((err) => {
				//Catch error
				setError(err);
			})
			.finally(() => {
				//Stop loading state
				setLoading(false);
			});
	};

	return { loading, error, data, fetchUrl };
}
