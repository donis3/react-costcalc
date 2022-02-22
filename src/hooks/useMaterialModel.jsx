import React from 'react';
import { ValidationError } from '../lib/ValidationError';
import { getMaxInArray } from '../lib/common';

export default function useMaterialModel(materials, setMaterials) {

    const addMaterial = (newMaterialData) => {
        
        //Validate new material

        //Generate id

        //Push to array
        setMaterials((currentValue) => {
			currentValue.unshift(newMaterialData);
			return currentValue;
		});
        

    }

    return {addMaterial}
}
