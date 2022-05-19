import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';
import useSettings from '../settings/useSettings';

export default function useRecipesReducer() {
	const { t } = useTranslation('pages/recipes');
	const { currencies } = useSettings();
	const config = useConfig();

	/**
	 * Materials Reducer
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
				throw new Error('Invalid Dispatch Type @ RecipesReducer');
			}
		}
	} //EOF

	return reducer;
}
