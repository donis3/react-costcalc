import { v4 as uuidv4, validate as isUuid } from 'uuid';
/**
 * Available Dispatches:
 *
 * @param {*} state current state
 * @param {*} action dispatch request params
 */
export default function packagesReducer(state, action) {
	const { type, payload = {}, error, success, dependencies = {} } = action;
	const { defaultPackage } = dependencies;

	const emptyPackage = {
		//Form fields
		...defaultPackage,
		//Auto Generated & Constant fields
		packageId: null,
		//Calculated Fields
		//createdAt: Date.now(),
		updatedAt: Date.now(),
		cost: 0,
		currency: 0,
		tax: 0,
		costWithTax: 0,
		costHistory: [],
		unit: 'kg',
	};

	const onSuccess = (newState) => {
		success?.();
		return newState;
	};

	const onError = (code) => {
		error?.(code);
		return state;
	};

	/**
	 *  ======================================================================
	 *                                  Actions
	 *  ======================================================================
	 */
	switch (type) {
		/**
		 * Add a package to packages repo
		 * Expects a payload of packages form values
		 */
		case 'add': {
			//Check payload
			if (!payload || 'name' in payload === false || !payload.name) return onError('InvalidData');

			//Generate an ID
			emptyPackage.packageId = uuidv4();

			//check unit
			payload.unit = payload?.productType === 'liquid' ? 'L' : 'kg';

			//create new item by merging empty object and payload
			const newItem = { ...emptyPackage, ...payload, createdAt: Date.now() };

			//Add to state
			return onSuccess([...state, newItem]);
		}

		/**
		 * Update a package using form values from payload
		 */
		case 'update': {
			//Check payload
			const { packageId } = payload || {};
			if (!isUuid(packageId)) return onError('InvalidData');

			//Find the target package
			const targetPackage = state.find((item) => item.packageId === packageId);
			if (!targetPackage) return onError('MissingItem'); //Couldnt find target item

			//merge old data and new data
			const newPackage = { ...targetPackage, ...payload };
			//Compare old data to new data
			if (JSON.stringify(newPackage) === JSON.stringify(targetPackage)) {
				//No changed were made. No need to update
				return onError('NoChange');
			}
			//Proceed to update. Add update time
			newPackage.updatedAt = Date.now();
			//Map state and update this item
			const newState = state.map((item) => (item.packageId !== packageId ? item : newPackage));

			return onSuccess(newState);
		}

		/**
		 * Remove a package from state
		 */
		case 'delete': {
			//Check payload
			const packageId = payload;
			if (!isUuid(packageId)) return onError('InvalidData');

			//Find requested subject
			const targetPackage = state.find((item) => item.packageId === packageId);
			if (!targetPackage) return onError('MissingItem'); //Couldnt find target item

			//Target to delete is found, remove it from state
			return onSuccess(state.filter((item) => item.packageId !== packageId));
		}

		/**
		 * Replace the whole state
		 */
		case 'updateAll': {
			//Replace state with given array
			if (!payload || Array.isArray(payload) === false) {
				return onError('InvalidData');
			}
			return onSuccess(payload);
		}

		/**
		 * Remove everything from state
		 */
		case 'reset': {
			return onSuccess([]);
		}
		/**
		 * Invalid Dispatch
		 */
		default: {
			throw new Error('Invalid Dispatch Type @ Packages');
		}
	}
} //EOF
