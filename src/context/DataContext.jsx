import React, { createContext, useMemo, useState } from 'react';

import data from '../data/defaultData.json';
import useMaterialModel from '../hooks/useMaterialModel';

const DataContext = createContext();

export function DataContextProvider({ children }) {
	const [materials, setMaterials] = useState(data.materials);
    const {addMaterial} = useMaterialModel(materials, setMaterials);


	const payload = {
		materials: {
			all: useMemo(() => materials, [materials]),
			add: addMaterial,
		},
	};

	return <DataContext.Provider value={payload}>{children}</DataContext.Provider>;
}

export default DataContext;
