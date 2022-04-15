import React from 'react';
import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';
import useIntl from '../../hooks/common/useIntl';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import OptionControl from './OptionControl';

/**
 * Main wrapper for item details page
 * Uses flex box
 * @returns
 */
function Wrapper({ children }) {
	return (
		<div className='w-full flex md:flex-row md:gap-x-10 gap-y-10 flex-col-reverse p-3'>
			{/* Flex Wrapper */}
			{children}
		</div>
	);
}

/**
 * Main wrapper for item details page
 * Uses grid
 * @param {*} param0
 * @returns
 */
function GridWrapper({ children, colsSmall, colsLarge }) {
	if (isNaN(parseInt(colsSmall))) colsSmall = 1;
	if (isNaN(parseInt(colsLarge))) colsLarge = 2;

	return <div className={`p-3 grid grid-cols-${colsSmall} gap-x-10 gap-y-5 md:grid-cols-${colsLarge}`}>{children}</div>;
}
GridWrapper.defaultProps = {
	colsSmall: 1,
	colsLarge: 2,
};

/**
 * Individual Items in the grid.
 * @param {*} param0
 * @returns
 */
function Item({ title = null, children, ...attributes } = {}) {
	if (typeof children === 'string' && children.trim().length === 0) {
		return <></>;
	}
	return (
		<div {...attributes}>
			{/* Details */}
			<h4 className='text-base-content opacity-60 text-sm mb-1'>{title}</h4>
			<p className='text-base-content text-base font-medium'>{children}</p>
		</div>
	);
}

/**
 * whitespace pre text item
 * @param {*} param0
 * @returns
 */
function ItemTextPre({ title = null, children, ...attributes } = {}) {
	if (typeof children === 'string' && children.trim().length === 0) {
		return <></>;
	}
	return (
		<div {...attributes}>
			{/* Details */}
			<h4 className='text-base-content opacity-60 text-sm mb-1'>{title}</h4>
			<p className='text-base-content text-base font-normal leading-tight whitespace-pre-wrap'>{children}</p>
		</div>
	);
}

/**
 * whitespace pre text item
 * @param {*} param0
 * @returns
 */
function RowItem({ title = null, pre = false, children, ...attributes } = {}) {
	if (typeof children === 'string' && children.trim().length === 0) {
		return <></>;
	}
	return (
		<div className='col-span-full' {...attributes}>
			{/* Details */}
			{title && <h4 className='text-base-content opacity-60 text-sm mb-1'>{title}</h4>}
			{pre && <p className='text-base-content text-base font-normal leading-tight whitespace-pre-wrap'>{children}</p>}
			{!pre && typeof children === 'string' && <p className='text-base-content text-base font-medium'>{children}</p>}
			{!pre && typeof children !== 'string' && <div>{children}</div>}
		</div>
	);
}

/**
 * Display a box with current price, and show price change if included
 * Show taxed price if included
 * @param {*} param0
 * @returns
 */
function UnitCostBox({ currency, price, priceWithTax, previousPrice, title, unit, className }) {
	//Type checks
	price = parseFloat(price);
	priceWithTax = parseFloat(priceWithTax);
	previousPrice = parseFloat(previousPrice);
	if (isNaN(price)) price = 0;
	if (isNaN(priceWithTax)) priceWithTax = price;
	if (isNaN(previousPrice)) previousPrice = price;

	const config = useConfig();
	const { t } = useTranslation('translation');
	if (!currency) currency = config.getDefaultCurrency(true);
	const { displayMoney, displayNumber } = useIntl();

	//Calculate price change
	let priceChange = 0;

	if (previousPrice !== price) {
		//There is a price change
		const diff = Math.abs(price - previousPrice);
		const percent = (diff / previousPrice) * 100;
		priceChange = diff > 0 ? percent : -percent;
	}

	const priceChangeIndicator = (
		<span className={`text-sm flex items-center ${priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
			{/* indicator */}
			{displayNumber(priceChange, 2)} % {priceChange > 0 ? <FaCaretUp /> : <FaCaretDown />}
		</span>
	);

	return (
		<div className={`w-full flex ${className ? className : null}`}>
			<div className='stats shadow flex-1'>
				<div className='stat'>
					<div className='stat-title flex justify-between gap-x-10'>
						<span>{title}</span>
						{/* Price change indicator */}
						{priceChange !== 0 && priceChangeIndicator}
					</div>

					<div className='stat-value text-3xl'>
						{displayMoney(price, currency)}
						<span className='text-base font-semibold ml-1 opacity-50'>/{unit}</span>
					</div>
					<div className='stat-desc'>
						{t('labels.priceWithTax', { price: `${displayMoney(priceWithTax, currency)}/${unit}` })}
					</div>
				</div>
			</div>
		</div>
	);
}
UnitCostBox.defaultProps = {
	currency: null,
	price: 0,
	priceWithTax: null,
	previousPrice: 0,
	title: '',
	unit: 'kg',
};

function Toggles({ setOption, getOption, options, ...attributes }) {
	const { t } = useTranslation('translation');
	const config = useConfig();
	const defaultCurrencyName = t('currency.' + config.getDefaultCurrency(true));

	if (!Array.isArray(options) || options.length === 0) return <></>;

	return (
		<div {...attributes}>
			{/* Generate toggles */}
			{options.map((opt, i) => {
				return (
					<OptionControl
						key={i}
						state={getOption(opt)}
						setState={() => setOption(opt)}
						text={t(`toggles.${opt}`, { currency: defaultCurrencyName })}
						checkboxFirst={true}
					/>
				);
			})}
		</div>
	);
}
Toggles.defaultProps = {
	setOption: () => {},
	getOption: () => {},
	options: [],
};

const ItemDetails = {
	Main: Wrapper,
	MainGrid: GridWrapper,
	Item: Item,
	RowItem,
	Pre: ItemTextPre,
	Price: UnitCostBox,
	Toggles: Toggles,
};

export default ItemDetails;
