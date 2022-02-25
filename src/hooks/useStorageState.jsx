import { useState } from 'react';
import config from '../config/config.json';

/**
 * Use browser local storage to have persistent state.
 * @param {*} identifier A unique key for local storage key. will be prefixed with app name
 * @param {*} initialValue Initial value for state
 * @returns {Array} [value, setValue]
 */
export default function useStorageState(identifier = null, initialValue = null) {
	const [state, setState] = useState( getInitialValue(identifier, initialValue) );
    const localStorageKey = getUniqueKey(identifier);
	if (!localStorageKey) return returnDefault(initialValue);
    

    //setState function that will save state in local storage
    const handleSetState = (newState) => {
        //If a function is passed, pass current state to it and get the result
        if(typeof newState === 'function') {
            newState = newState(state);
        }
        //Save new state to local storage
        setData(localStorageKey, newState);
        //Save new state to react state
        setState(newState);
    }
	return [state, handleSetState];
}

//Create erroneous return array for failures
const returnDefault = (defaultValue = null) => {
	const msg = 'StorageState Error: A unique identifier is required.';
	const defaultSetter = () => {
		config.debug.storage && console.log(msg);
	};
	//Inform error
	defaultSetter();
	//return hook
	return [defaultValue, defaultSetter];
};

//Get unique key for this state
const getUniqueKey = (identifier = null) => {
	if (!identifier) return null;
    //Clean the identifier
    identifier = identifier.replace(/\s/g, '_');
    identifier = identifier.replace(/\W/g, '');
    //check again
    if(identifier.length === 0) return null;
	return `${config.app.localStorageKey}.${identifier}`;
};

const setData = (key = null, data) => {
	if (!key) return false;

	try {
		//Convert data
		const jsonData = JSON.stringify(data);
		//compare to current
		const currentData = localStorage.getItem(key);
		if (jsonData === currentData) {
			//Both values same, no need to save
			return;
		}
        //Save to storage
		localStorage.setItem(key, jsonData);
        return true;
	} catch (error) {
        //Error ocurred 
        config.debug.storage && console.log(error);
        return false;
    }
};

const getData = (key = null) => {
    if(!key) return null;
    try {
        const jsonData = localStorage.getItem(key);
        const data = JSON.parse(jsonData);
        return data;
    } catch (error) {
        config.debug.storage && console.log(error);
        return null;
    }
}

// const removeData = (key = null) => {
//     if(!key) return null;
//     try {
//         localStorage.removeItem(key);
//         return true;
//     } catch (error) {
//         config.debug.storage && console.log(error);
//         return null;
//     }
// }

const getInitialValue = (identifier = null, initialValue = null) =>  {
    const key = getUniqueKey(identifier);
    if(!key) return null;

    //Check if key exists in local. If it does, return data in local,
    //If key doesn't exist, create the key and save initialValue, 
    

    const data = getData(key);
    if(data === null) { //Key doesnt exist
        //no data found, save initialValue to local storage 
        setData(key, initialValue);
        //Return initial value
        return initialValue;
    }else {
        //Data is found in local storage, return it instead of default initialValue
        return data;
    }

}