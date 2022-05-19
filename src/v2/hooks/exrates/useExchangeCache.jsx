import useStorageState from '../common/useStorageState';

export default function useExchangeCache({ id = null, cacheDurationMinutes = 1 } = {}) {
	const cacheName = id ? `cache_${id}` : null;
	const [cache, setCache] = useStorageState(cacheName, { updatedAt: null, data: null });

	/**
	 * Default cache duration is 1 min and can't be lower.
	 * Max duration is 1 day (1440 minutes)
	 */
	cacheDurationMinutes = parseInt(cacheDurationMinutes);
	if (isNaN(cacheDurationMinutes) || cacheDurationMinutes <= 0) cacheDurationMinutes = 1;
	if (cacheDurationMinutes > 1440) cacheDurationMinutes = 1440;
	const cacheDuration = cacheDurationMinutes * 60 * 1000;

	//Check if cache is expired
	let isExpired = true;
	if (id && cache && cache.updatedAt > 1) {
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
		if (!id) return;

		setCache({ updatedAt: Date.now(), data });
	}

	return { cache, setCache: setCacheData, isExpired };
}
