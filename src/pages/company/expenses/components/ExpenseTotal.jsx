import React from 'react';
import { useTranslation } from 'react-i18next';
import useCompanyDefaults from '../../../../context/company/useCompanyDefaults';
import useConfig from '../../../../hooks/app/useConfig';
import useIntl from '../../../../hooks/common/useIntl';

/**
 * Takes currently shown expenses array to calculate totals
 * @param {*} param0
 */
export default function ExpenseTotal({ expenses, options }) {
	const { t } = useTranslation('pages/company', 'translation');
	const { displayMoney } = useIntl();
	const config = useConfig();
	const defaultCurrency = config.getDefaultCurrency(true);
	const period = options?.showPeriod ? options.showPeriod : 'y';
	const currentPeriodText = t(`periods.${options.showPeriod}`, { ns: 'translation' });
	const { periodCoefficients } = useCompanyDefaults();
	const coefficient = period in periodCoefficients ? periodCoefficients[period] : 1;

	const totals = expenses.reduce(
		(acc, expense) => {
			const { localAnnualCost, localAnnualCostWithTax } = expense;
			acc.net += isNaN(parseFloat(localAnnualCost)) ? 0 : parseFloat(localAnnualCost);
			acc.withTax += isNaN(parseFloat(localAnnualCostWithTax)) ? 0 : parseFloat(localAnnualCostWithTax);
			return acc;
		},
		{ net: 0, withTax: 0, currency: defaultCurrency }
	);

	return (
		<div className='w-full flex items-center justify-start mb-3 '>
			<div className='stats border flex-1'>
				<div className='stat'>
					<div className='stat-title'>{t('expensesTable.periodCost', { period: currentPeriodText })}</div>
					<div className='stat-value'>{displayMoney(totals.net / coefficient, totals.currency)}</div>
					<div className='stat-desc'>
						{t('labels.priceWithTax', {
							ns: 'translation',
							price: displayMoney(totals.withTax / coefficient, totals.currency),
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

ExpenseTotal.defaultProps = {
	options: { showPeriod: 'y', showCategory: [] },
	expenses: [],
};
