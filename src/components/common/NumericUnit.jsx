import React from 'react';
import { useTranslation } from 'react-i18next';
import useIntl from '../../hooks/common/useIntl';

export default function NumericUnit({ type = null, children, isPer = false, short = false } = {}) {
	const { displayNumber } = useIntl();
	const { t, i18n } = useTranslation('translation');
	let unit = <></>;
	const translationKey = short ? 'unitsShort' : 'units';
	const count = isNaN(parseInt(children)) === false ? Math.round(children) : 1;

	switch (type) {
		case 'density':
			unit = (
				<>
					g/cm<sup>3</sup>
				</>
			);
			break;
		case 'L':
		case 'l':
		case 'Liter':
		case 'volume':
			unit = t(`${translationKey}.L`, { count: count });
			break;
		case 'kg':
		case 'KG':
		case 'Kg':
		case 'weight':
		case 'mass':
			unit = t(`${translationKey}.kg`, { count: count });
			break;
		default:
			if (i18n.exists(`${translationKey}.${type}`, { ns: 'translation' })) {
				unit = t(`${translationKey}.${type}`, { count: count });
			} else {
				unit = type;
			}
			break;
	}

	return (
		<>
			{isNaN(parseFloat(children)) === false ? displayNumber(children, 2) : children}
			<span className='ml-1 text-sm opacity-75'>
				{unit && isPer && '/'}
				{unit}
			</span>
		</>
	);
}
