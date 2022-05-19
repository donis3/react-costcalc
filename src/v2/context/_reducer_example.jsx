import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';
import useSettings from '../settings/useSettings';

export default function useProductsReducer() {
	const { t } = useTranslation('pages/products');
	const { currencies } = useSettings();
	const config = useConfig();

	/**
	 * Products Reducer
	 */
	function reducer(state, action) {
		const { type, payload = {}, error, success } = action;

		const onSuccess = (newState) => {
			success?.();
			return newState;
		};

		const onError = (code) => {
			error?.(code ? t(`error.${code}`) : '');
			return state;
		};


        /**
         *  ======================================================================
         *                                  Actions
         *  ======================================================================
         */
		switch (type) {
			/**
			 * Invalid Dispatch
			 */
			default: {
				throw new Error('Invalid Dispatch Type @ ProductsReducer');
			}
		}
	} //EOF

	return reducer;
}
