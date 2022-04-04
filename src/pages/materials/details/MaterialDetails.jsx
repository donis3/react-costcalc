import React from 'react';
import { useTranslation } from 'react-i18next';
import ItemDetails from '../../../components/common/ItemDetails';
import NumericUnit from '../../../components/common/NumericUnit';
import useUiToggles from '../../../hooks/app/useUiToggles';
import useIntl from '../../../hooks/common/useIntl';

export default function MaterialDetails({ material }) {
	const { t } = useTranslation('pages/materials', 'translation');
	const { displayNumber } = useIntl();

	//Ui Options
	const [getOption, setOption] = useUiToggles();
	const toggleOptions = [];
	//Which checkboxes to display
	if (material.isBaseUnit === false) toggleOptions.push('baseUnit');
	if (material.isForeignCurrency === true) toggleOptions.push('localPrice');
	//Price data based on ui toggles
	const currentPrice = material.getPrice({ local: getOption('localPrice'), base: getOption('baseUnit') });
	const previousPrice = material.getPreviousPrice({ local: getOption('localPrice'), base: getOption('baseUnit') });

	return (
		<ItemDetails.Main>
			{/* Column Left */}
			<div className='flex-1 flex flex-col gap-y-5'>
				{/* Name */}
				<ItemDetails.Item title={t('details.name')}>{material.name}</ItemDetails.Item>
				{/* Supplier */}
				<ItemDetails.Item title={t('details.provider')}>{material.provider}</ItemDetails.Item>
				{/* Tax */}
				<ItemDetails.Item title={t('details.tax')}>{displayNumber(material.tax, 2)} %</ItemDetails.Item>
				{/* Density */}
				{material.isLiquid && (
					<ItemDetails.Item title={t('details.density')}>
						<NumericUnit type={'density'}>{material.density}</NumericUnit>
					</ItemDetails.Item>
				)}
			</div>
			{/* Column Right */}
			<div className='flex flex-col gap-y-3 min-w-[40%]'>
				{/* Price Details */}
				<ItemDetails.Price
					title={t('details.price')}
					price={currentPrice.price}
					currency={currentPrice.currency}
					priceWithTax={currentPrice.priceWithTax}
					previousPrice={previousPrice.price}
					unit={currentPrice.unit}
				/>

				{/* Ui Toggles */}
				<ItemDetails.Toggles setOption={setOption} getOption={getOption} options={toggleOptions} />
			</div>
		</ItemDetails.Main>
	);
}

MaterialDetails.defaultProps = {
	material: null,
};
