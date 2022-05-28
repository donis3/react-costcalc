import { useContext } from 'react';
import { CompanyContext, CompanyDispatchContext } from '.';

import useCompanyToaster from './useCompanyToaster';

export default function useCompanyInfo() {
	const company = useContext(CompanyContext);
	const dispatch = useContext(CompanyDispatchContext);
	const { successToast, errorToast } = useCompanyToaster();

	const CompanyInfoActions = {
		/**
		 * Reset company information
		 */
		deleteInfo: function (callback) {
			const action = {
				type: 'ResetCompanyInfo',
				success: successToast('delete', company.info.name),
				error: errorToast(),
			};
			dispatch(action);
			//Run callback after dispatch complete regardless of result
			callback?.();
		},
		/**
		 * Update company information
		 * @param {*} data object with new data keys
		 */
		updateInfo: function (data, callback) {
			const action = {
				type: 'UpdateCompanyInfo',
				payload: data,
				success: successToast('update', company.info.name),
				error: errorToast(),
			};
			dispatch(action);
			//Run callback after dispatch complete regardless of result
			callback?.();
		},
	};

	return {
		company,
		info: company.info,
		actions: CompanyInfoActions,
	};
}
