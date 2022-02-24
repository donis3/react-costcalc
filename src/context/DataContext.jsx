import React, { createContext, useMemo, useState } from 'react';

import data from '../data/defaultData.json';
import useMaterialModel from '../hooks/useMaterialModel';
import useStorage from '../hooks/useStorage';


const DataContext = createContext();

export function DataContextProvider({ children }) {
	const [materials, setMaterials] = useState(data.materials);
	const materialModel = useMaterialModel(materials, setMaterials);
	const storage = useStorage('materials');
	const storage2 = useStorage('yarraks');


	
	// const payload = {
	// 	materials,
	// 	addMaterial
	// };

	const payload = {
		materials: useMemo( () =>  materialModel, [materialModel])
	}

	return <DataContext.Provider value={payload}>{children}</DataContext.Provider>;
}

export default DataContext;
