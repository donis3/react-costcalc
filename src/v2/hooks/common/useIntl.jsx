import useApp from '../../context/app/useApp';
import useSettings from '../../context/settings/useSettings';

export default function useIntl() {
	const { language } = useApp();
	const { defaultCurrency } = useSettings();

	/**
	 * Return string with intl formatted number
	 * @param {*} amount
	 * @param {*} currency
	 */
	const displayMoney = (amount = 0, currency = defaultCurrency) => {
		try {
			return new Intl.NumberFormat(language.locale, { style: 'currency', currency: currency }).format(amount);
		} catch (error) {
			return `${amount.toFixed(2)} ${currency}`;
		}
	};

	/**
	 * Return string with intl formatted number
	 * @param {*} amount
	 */
	const displayNumber = (amount = 0, digits = null) => {
		try {
			if (digits !== null && digits > 0) {
				return new Intl.NumberFormat(language.locale, {
					minimumFractionDigits: digits,
					maximumFractionDigits: digits,
				}).format(amount);
			}
			return Intl.NumberFormat(language.locale).format(amount);
		} catch (error) {
			return amount;
		}
	};

	const displayDate = (timestamp = null, options = null) => {
		if (!timestamp) return null;
		if (!options || typeof options !== 'object') {
			options = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: undefined,
				hour12: false,
			};
		}
		try {
			const date = new Date(timestamp);
			return new Intl.DateTimeFormat(language.locale, options).format(date);
		} catch (error) {
			return null;
		}
	};

	return { displayMoney, displayNumber, displayDate };
}
