import { useEffect } from 'react';

/**
 * Will call the callback whenever we click outside the given ref
 */
export default function useClickOutside(ref = null, callback = null) {
	useEffect(() => {
		if (!ref || !ref.current) return;
		if (typeof callback !== 'function') return;

		//Define event and removal
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				callback();
			}
		}
		function removeEvent() {
			document.removeEventListener('mousedown', handleClickOutside);
			//console.log('Removed Event Listener');
		}

		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		// Unbind the event listener on clean up
		return removeEvent;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref]);
}
