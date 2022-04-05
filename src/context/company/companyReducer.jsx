import defaultCompany from './defaultCompany';

export default function companyReducer(state, action) {
	if (typeof action !== 'object' || 'type' in action === false) action = {};
	const { type = null, payload = null, success = null, error = null } = action;

	function onSuccess(newState) {
		if (typeof success === 'function') success();
		return newState;
	}

	function onError(errCode = null) {
		if (typeof error === 'function') error(errCode);
		return state;
	}

	switch (type) {
		case 'add': {
			return onError();
		}

		/**
		 * Requires a payload of company info object
		 * Will merge it with current company info state and update if necessary
		 */
		case 'UpdateCompanyInfo': {
			//Verify
			if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) {
				return onError('invalidData');
			}
			//Merge
			const newInfo = { ...state.info, ...payload };
			//Compare
			if (JSON.stringify(newInfo) === JSON.stringify(state.info)) {
				return onError('updateNotRequired');
			}
			//Update
			return onSuccess({ ...state, info: newInfo });
		}

		/**
		 * Removes all company information and reverts to default values
		 */
		case 'ResetCompanyInfo': {
			//Verify
			if (!defaultCompany || typeof defaultCompany !== 'object' || 'info' in defaultCompany === false) {
				//Default company data is invalid
				return onError('invalidData');
			}
			//Compare
			if (JSON.stringify(defaultCompany.info) === JSON.stringify(state?.info)) {
				//State info and default info are the same, no need to update
				return onError('updateNotRequired');
			}
			//Update
			return onSuccess({ ...state, info: defaultCompany.info });
		}
		default: {
			throw new Error('Invalid action type received.');
		}
	}
}
