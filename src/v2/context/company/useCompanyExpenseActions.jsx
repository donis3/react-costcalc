import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyDispatchContext } from '.';
import useCompanyToaster from './useCompanyToaster';

export default function useCompanyExpenseActions() {
	// eslint-disable-next-line no-unused-vars
	const dispatch = useContext(CompanyDispatchContext);
	const { successToast, errorToast } = useCompanyToaster();
	const { t } = useTranslation('pages/company');

	function addExpense(expense, callback) {
		const action = {
			type: 'AddExpense',
			payload: expense,
			success: successToast('add', expense?.name),
			error: errorToast(null, t('expenses.name')),
		};
		dispatch(action);
		//Run callback after dispatch complete regardless of result
		callback?.();
	}

	function updateExpense(expense, callback) {
		const action = {
			type: 'UpdateExpense',
			payload: expense,
			success: successToast('update', expense?.name),
			error: errorToast(null, t('expenses.name')),
		};
		dispatch(action);
		//Run callback after dispatch complete regardless of result
		callback?.();
	}

	function deleteExpense(expense, callback) {
		const action = {
			type: 'DeleteExpense',
			payload: expense,
			success: successToast('delete', expense?.name),
			error: errorToast(null, t('expenses.name')),
		};
		dispatch(action);
		//Run callback after dispatch complete regardless of result
		callback?.();
	}

	return {
		add: addExpense,
		update: updateExpense,
		delete: deleteExpense,
	};
}
