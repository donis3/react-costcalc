import { useEffect, useState } from 'react';
import config from '../../config/config.json';


function useStorage() {
	const [storage, setStorage] = useState(loadStorage());

	//When storage changes, save new state to local storage
	useEffect(() => {
		
		saveStorage(storage);
	}, [storage]);


	const getStoredData = (key = null) => {
		if (!key) {
			config.debug.storage && console.log('Storage Error: trying to get value with a null key');
			return;
		}
		if (key in storage === false) return null;

		return storage[key];
	};

	const setStoredData = (key = null, value = null) => {
		if (!key) {
			config.debug.storage && console.log('Storage Error: trying to set value with a null key');
			return;
		}
		//Compare old value
		if (key && key in storage === true && storage[key] === value) {
			//Trying to save same data
			return;
		}
		//Before writing, refresh stored data from local storage.
		//This is because there may be another module using useStorage and save at the same time.
		//THey'll have different states and only the last one to write will reflect
		const savedData = loadStorage();
		const newState = {...savedData, [key]: value}
		setStorage(newState);
	};

	//remove a key from current storage object
	const deleteStoredData = (key = null) => {
		if (!key) {
			config.debug.storage && console.log('Storage Error: trying to remove a null key');
			return null;
		}
		//Check if exists
		if (key in storage === false) {
			config.debug.storage && console.log('Storage Error: trying to remove non-existing key');
			return null;
		}

		//Store data
		const data = storage[key];

		//remove
		setStorage( (oldState) => {
			delete oldState[key];
			return oldState;
		})

		return data;
	}

	return { getStoredData, setStoredData, deleteStoredData };
}

// ============== Storage Helpers ============

//Get current storage key for app data
const appStorageKey = () => {
	let key = config?.app?.localStorageKey;
	if (!key) key = process.env?.REACT_APP_NAME || 'default';

	if (key === 'default' && config.debug.storage) {
		console.log('Warning: Application storage key could not be determined.');
	}
	return key;
};

//Load whole data for this app's key in local storage and parse it as object from json
const loadStorage = () => {
	const storageKey = appStorageKey();
	const data = localStorage.getItem(storageKey);
	let result = {};
	try {
		result = JSON.parse(data);
	} catch (error) {
		config.debug.storage && console.log(`Couldn't parse local storage for ${storageKey}`);
	}
	return result ? result : {};
};

//Save current storage to local
const saveStorage = (currentStorage) => {
	const storageKey = appStorageKey();
	if (typeof currentStorage !== 'object' || Object.keys(currentStorage).length === 0) {
		currentStorage = {};
	}
	//Json stringify
	const data = JSON.stringify(currentStorage, null, 0);
	//Check if anything is new
	if( localStorage.getItem(storageKey) === data) {
		//No need to save, values are same
		return;
	}
	try {

		config.debug.storage && console.log('Saving local storage...');
		localStorage.setItem(storageKey, data);
	} catch (error) {
		config.debug.storage && console.log(`Warning: local storage save failed.`, error);
	}
};
