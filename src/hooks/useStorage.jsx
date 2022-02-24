import React, { useEffect, useState } from 'react';
import config from '../config/config.json';

export default function useStorage(namespace = 'default') {
	const [storage, setStorage] = useState(loadStorage(namespace));
	
	//On load
	useEffect(() => {
		
	}, [namespace]);

	//When storage changes, save to local
	useEffect(() => {
		
	}, [storage]);



	return {};
}

const appStorageKey = () => {
	let key = config?.app?.localStorageKey;
	if (!key) key = process.env?.REACT_APP_NAME || 'default';
	return key;
};



//Load whole data for this app's key in local storage and parse it as object from json
const loadStorage = (namespace = null) => {
    const storageKey = appStorageKey();
	const data = localStorage.getItem(storageKey);
	let result = {};
	try {
		result = JSON.parse(data);
	} catch (error) {
		console.log(`Couldn't parse local storage for ${storageKey}`);
	}
	return result ? result : {};
};

//Initialize given namespace if it does not exist
const initNs = (currentStorage, setCurrentStorage, namespace) => {
	//Invalid storage, turn it into object
	if (!currentStorage || typeof currentStorage !== 'object') {
		setCurrentStorage({ [namespace]: {} });
		return;
	}
	//Namespace doesn't exist. Create it
	if (namespace in currentStorage === false) {
		setCurrentStorage((oldData) => {
			return { ...oldData, [namespace]: {} };
		});
	}
    //Namespace not an object
    if( currentStorage[namespace] === null || typeof currentStorage[namespace] !== 'object') {
        setCurrentStorage((oldData) => {
			return { ...oldData, [namespace]: {} };
		});
    }
	return;
};

//Save current storage to local
const saveStorage = (currentStorage) => {
    const storageKey = appStorageKey();
	if (typeof currentStorage !== 'object' || Object.keys(currentStorage).length === 0) {
		currentStorage = {};
	}
	const data = JSON.stringify(currentStorage, null, 0);

	localStorage.setItem(storageKey, data);
};
