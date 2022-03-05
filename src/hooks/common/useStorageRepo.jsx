import { useState } from 'react';
//Will get 2 keys from config
// config.debug.storage for verbose errors
// config.app.localStorageKey for app specific unique storage key
import config from '../../config/config.json';

//Store multiple tables at same local storage key
export default function useStorageRepo(repoName = null, itemName = null, initialData = null) {
	//Will load data from storage if available, or generate using passed in initialData
	const initialState = getInitialState(repoName, itemName, initialData);
	//React state hook with initialState taken from storage
	const [itemState, setItemState] = useState(initialState);

	/**
	 * Set any data at your current repo/item.
	 * Data will be stored in state and will persist through local storage if available
	 * @param {*} newItemData Data to be stored in state & storage
	 */
	const setItem = (newItemData) => {
		//React State
		setItemState(newItemData);
		//Storage
		saveStorageItem(repoName, itemName, newItemData);
	};

	//Remove an item from current repo if such a need rises
	const deleteItem = () => {
		removeStorageRepoItem(repoName, itemName);
	}

	return [itemState, setItem, deleteItem];
}

//Local Storage Helpers

//Check if table exists in repo, return data if exists. If not, create table with initial data
const getInitialState = (repoName, itemName, initialData) => {
	let currentData = getStorageRepoItem(repoName, itemName);
	if (currentData === null) {
		//No data found in repo, create it
		currentData = saveStorageItem(repoName, itemName, initialData);
	}
	return currentData;
};

//Check if local storage has given key
const doesStorageKeyExist = (key = null) => {
	if (!key || typeof key !== 'string' || key.length === 0) return false;
	try {
		return Object.keys(localStorage).includes(key);
	} catch (error) {
		config.debug.storage && console.log(`Storage Error (doesStorageKeyExist)`, error);
		return false;
	}
};

//Check if item exists in current repo. Return null if not
const getStorageRepoItem = (repoName = null, itemName = null) => {
	try {
		//Validate Repo & table name
		const repoKey = getRepoStorageKey(repoName);
		if (!doesStorageKeyExist(repoKey)) return null;
		if (!itemName || typeof itemName !== 'string') return null;

		//Get repo and parse
		const rawData = localStorage.getItem(repoKey);
		const data = JSON.parse(rawData);
		//Return table if exists
		if (typeof data === 'object' && Object.keys(data).length > 0 && Object.keys(data).includes(itemName)) {
			return data[itemName];
		}
		return null;
	} catch (error) {
		//Json parse error at key
		config.debug.storage && console.log(`Storage Error (getStorageRepoItem)`, error);
		return null;
	}
};

const removeStorageRepoItem = (repoName = null, itemName = null) => {
	try {
		//Validate Repo & table name
		const repoKey = getRepoStorageKey(repoName);
		if (!doesStorageKeyExist(repoKey)) return null;
		if (!itemName || typeof itemName !== 'string') return null;

		//Get repo and parse
		const rawData = localStorage.getItem(repoKey);
		const data = JSON.parse(rawData);
		//Remove table from data if exists
		if (typeof data === 'object' && Object.keys(data).length > 0 && Object.keys(data).includes(itemName)) {
			delete data[itemName];
			//save new data
			const newRawData = JSON.stringify(data);
			localStorage.setItem(repoKey, newRawData);
			config.debug.storage && console.log(`[StorageRepo] Deleted ${itemName} from ${repoName}.`);
		}
		return data;
	} catch (error) {
		//Json parse error at key
		config.debug.storage && console.log(`Storage Error (getStorageRepoItem)`, error);
		return null;
	}
};

//Return repo if exists, empty object if not
const getStorageRepo = (repoName = null) => {
	try {
		//Validate Repo & table name
		const repoKey = getRepoStorageKey(repoName);
		if (!doesStorageKeyExist(repoKey)) return {};

		//Get repo and parse
		const rawData = localStorage.getItem(repoKey);
		const data = JSON.parse(rawData);
		if (data && typeof data === 'object' && Object.keys(data).length > 0) {
			return data;
		}
		return {};
	} catch (error) {
		//Json parse error at key
		config.debug.storage && console.log(`Storage Error (getStorageRepo)`, error);
		return {};
	}
};

//Save data to repo/item and return saved data back
const saveStorageItem = (repoName = null, itemName = null, data = null) => {
	//Get repo key
	const repoKey = getRepoStorageKey(repoName);

	//Try to get old data
	let currentRepoString = '';
	try {
		currentRepoString = localStorage.getItem(repoKey);
	} catch (error) {
		//Couldnt read old data
	}

	//Save new data
	try {
		if (!repoKey) throw new Error('Repo key could not be generated');
		//Get current repo
		const currentRepo = getStorageRepo(repoName);
		//Override or create table name
		const newRepo = { ...currentRepo, [itemName]: data };
		//Create Json Data
		const newRepoString = JSON.stringify(newRepo);
		//Compare to old data
		if (currentRepoString === newRepoString) {
			//Current storage data and new data are the same. No need to save
			return null;
		}
		//Save to storage
		localStorage.setItem(repoKey, newRepoString);

		config.debug.storage && console.log(`Saved data to ${repoName}/${itemName}`);
		//return data back
		return data;
	} catch (error) {
		config.debug.storage && console.log(`Storage Error (saveStorageTable)`, error);
		//If there was an error, still return data to be able to work with only react state
		return data;
	}
};

//Generate storage key for this repo. appname.reponame
const getRepoStorageKey = (repoName = null) => {
	if (!repoName) return null;
	//Clean the identifier
	repoName = repoName.replace(/\s/g, '_');
	repoName = repoName.replace(/\W/g, '');
	//check again
	if (repoName.length === 0) return null;
	return `${config.app.localStorageKey}.${repoName}`;
};
