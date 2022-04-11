import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';

export default function ExpenseDetails() {
	const { page } = useAppContext();
	const { expenseId } = useParams();

	useEffect(() => {
		if (expenseId) {
			page.setBreadcrumb('Expense Name');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return <div>ExpenseDetails ({expenseId})</div>;
}
