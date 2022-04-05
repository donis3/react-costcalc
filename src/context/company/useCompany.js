import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CompanyContext } from '../CompanyContext';

/**
 * Access company context using this hook and only this hook.
 * @returns
 */
export default function useCompany() {
	const [company, dispatch] = useContext(CompanyContext);
	const { successToast, errorToast } = useCompanyToaster();

	//================// Company Info //====================//
	const CompanyInfoActions = {
		/**
		 * Reset company information
		 */
		deleteInfo: function (callback) {
			const action = {
				type: 'ResetCompanyInfo',
				success: successToast('delete', company.info.name, callback),
				error: errorToast(),
			};
			dispatch(action);
		},
		/**
		 * Update company information
		 * @param {*} data object with new data keys
		 */
		updateInfo: function (data, callback) {
			const action = {
				type: 'UpdateCompanyInfo',
				payload: data,
				success: successToast('update', company.info.name, callback),
				error: errorToast(),
			};
			dispatch(action);
		},
	};
	//Exports
	return { company, info: company.info, dispatch, CompanyInfoActions };
} //End of hook

/**
 * Toast Factory
 * Generates callable toast functions for dispatch callbacks
 * @returns
 */
function useCompanyToaster() {
	const { t } = useTranslation('pages/company', 'translation');

	const errorToast = (callback = null) => {
		//return toast function
		return (errorCode) => {
			toast.error(t(`error.${errorCode}`, { ns: 'translation' }), { toastId: 'company-success' });
			if (typeof callback === 'function') callback();
		};
	};

	const successToast = (type = 'add', name = null, callback = null) => {
		if (!name) name = t('name');
		const msg = t(`success.${type}`, { ns: 'translation', name });

		//Return toast function
		return () => {
			toast.success(msg, { toastId: 'company-error' });
			if (typeof callback === 'function') callback();
		};
	};

	return {
		successToast,
		errorToast,
	};
} //End of hook
