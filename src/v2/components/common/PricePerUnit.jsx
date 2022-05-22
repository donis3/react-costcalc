import { useTranslation } from 'react-i18next';
import useMoney from '../../hooks/app/useMoney';

export default function PricePerUnit({ unit = null, currency = null, children } = {}) {
	const { t, i18n } = useTranslation('translation');
	const { displayMoney, defaultCurrency } = useMoney();
	if (!currency) currency = defaultCurrency;

	if (i18n.exists('units.' + unit, { ns: 'translation' })) {
		unit = t('units.' + unit, { ns: 'translation' });
	}
	if (typeof unit === 'string' && unit.trim().length > 0) {
		unit = '/' + unit;
	}

	return (
		<>
			{isNaN(parseFloat(children)) === false ? displayMoney(children, currency) : `${children} ${currency}`}
			<span className='ml-1 text-sm opacity-75'>{unit}</span>
		</>
	);
}
