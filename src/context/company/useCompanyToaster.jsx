import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

/**
 * Toast Factory
 * Generates callable toast functions for dispatch callbacks
 * @returns
 */
export default function useCompanyToaster() {
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
