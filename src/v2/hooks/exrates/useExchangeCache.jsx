import React from 'react';
import useConfig from '../app/useConfig';
import useStorageState from '../common/useStorageState';

export default function useExchangeCache({ id = null, cacheDurationMinutes = 1 } = {}) {
	const [cache, setCache] = useStorageState(`cache_${id}`, { updatedAt: null, data: null });

	//Convert minutes to milliseconds
	cacheDurationMinutes = parseInt(cacheDurationMinutes);
	if (isNaN(cacheDurationMinutes)) cacheDurationMinutes = 30;
	const cacheDuration = cacheDurationMinutes * 60 * 1000;

	//Check if cache is expired
	let isExpired = true;
	if (cache && cache.updatedAt > 1) {
		const timePassed = Date.now() - cache.updatedAt;
		if (timePassed > cacheDuration) {
			//enough time has passed
			isExpired = true;
		} else {
			isExpired = false;
		}
	}

	function setCacheData(data) {
		if (!Array.isArray(data)) return;
		setCache({ updatedAt: Date.now(), data });
	}

	return { cache, setCache: setCacheData, isExpired };
}
