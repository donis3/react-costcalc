import React, { createContext, useEffect, useMemo, useState } from 'react';

import useMaterialModel from '../hooks/useMaterialModel';
import useStorage from '../hooks/useStorage';

const DataContext = createContext();

export function DataContextProvider({ children }) {
	const storage = useStorage();
	const [materials, setMaterials] = useState(getMaterialsFromStorage(storage)); //Init state with current storage data
	const materialModel = useMaterialModel(materials, setMaterials);

	//When materials change, save it to local storage
	useEffect(() => {
		saveMaterialsToStorage(materials, storage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [materials]);

	const payload = {
		materials: useMemo(() => materialModel, [materialModel]),
	};

	return <DataContext.Provider value={payload}>{children}</DataContext.Provider>;
}

export default DataContext;

//Storage Helpers
const getMaterialsFromStorage = (storage) => {
	let result = [];
	if (!storage || 'getStoredData' in storage === false) return result;

	const storedMaterials = storage.getStoredData('materials');
	if (storedMaterials && Array.isArray(storedMaterials) && storedMaterials.length > 0) {
		result = storedMaterials;
	}
	return result;
};

const saveMaterialsToStorage = (materials, storage) => {
	if (!storage || 'setStoredData' in storage === false) return;
	if (!materials || !Array.isArray(materials)) {
		return storage.setStoredData('materials', []);
	}
	return storage.setStoredData('materials', materials);
};
