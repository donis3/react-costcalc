import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCaretDown, FaCaretLeft, FaUndoAlt } from 'react-icons/fa';
import OptionControl from '../../../components/common/OptionControl';
import useCompanyDefaults from '../../../context/company/useCompanyDefaults';
import useCompanyExpenses from '../../../context/company/useCompanyExpenses';
import useConfig from '../../../hooks/app/useConfig';

export default function ExpenseOptions({ setOption, options, display }) {
	const { t } = useTranslation('pages/company', 'translation');
	const config = useConfig();
	const defaultCurrency = config.getDefaultCurrency(true);
	const [expanded, setExpanded] = useState(false);
	const { getAvailableCategories } = useCompanyExpenses();
	const { periods } = useCompanyDefaults();
	if (!Array.isArray(display)) display = ['category', 'period', 'options'];

	const isCategoryActive = (category) => {
		if ('showCategory' in options === false) return true;
		if (!Array.isArray(options.showCategory)) return false;
		if (options.showCategory.length === 0) return true;
		if (options.showCategory.includes(category)) return true;
		return false;
	};
	const toggleCategory = (category = null) => {
		if (!category) return;
		if (category === 'all') {
			return setOption('showCategory', []);
		}
		//Get current categories
		const currentCategories = Array.isArray(options.showCategory) ? options.showCategory : [];
		if (currentCategories.includes(category)) {
			//Already active, deactivate
			return setOption(
				'showCategory',
				currentCategories.filter((item) => item !== category)
			);
		} else {
			//Add to active categories
			return setOption('showCategory', [...currentCategories, category]);
		}
	};

	const changePeriod = (period = null) => {
		if (isPeriodActive(period)) return;
		if (!period) return;
		if (!periods.includes(period)) return;
		setOption('showPeriod', period);
	};
	const isPeriodActive = (period = null) => {
		if (period && periods.includes(period) && options?.showPeriod === period) return true;
		return false;
	};

	return (
		<div className='mb-10'>
			{/* Options Toggle */}
			<div className='w-full flex p-1 justify-end -mb-3'>
				<button type='button' className='badge badge-secondary' onClick={() => setExpanded(!expanded)}>
					{expanded ? <FaCaretDown /> : <FaCaretLeft />}
					{Array.isArray(options?.showCategory) && options.showCategory.length > 0
						? t('labels.filtering', { ns: 'translation', count: options.showCategory.length })
						: t('buttons.options', { ns: 'translation' })}
				</button>
			</div>
			{expanded ? (
				<div className='w-full min-h-[50px] transition-opacity'>
					<div className='w-full h-full p-3  border border-neutral rounded-md'>
						{display.includes('category') && (
							<>
								{/* Category Options */}
								<ExpenseOptionsTitle onClick={() => toggleCategory('all')}>
									{t('expensesTable.categoryOptions')}
								</ExpenseOptionsTitle>
								<div className='flex flex-wrap gap-5 mt-3 mb-5'>
									{getAvailableCategories().map((category, index) => {
										return (
											<ExpenseOptionItem
												key={index}
												text={t(`expenseCategories.${category}`)}
												isActive={isCategoryActive(category)}
												onClick={() => toggleCategory(category)}
											/>
										);
									})}
								</div>
							</>
						)}

						{display.includes('period') && (
							<>
								{/* period Options */}
								<ExpenseOptionsTitle>{t('expensesTable.periodOptions')}</ExpenseOptionsTitle>
								<div className='flex flex-wrap gap-5 mt-3 mb-5'>
									{periods.map((period, index) => {
										return (
											<ExpenseOptionItem
												key={index}
												text={t(`periods.${period}`, { ns: 'translation' })}
												isActive={isPeriodActive(period)}
												onClick={() => changePeriod(period)}
											/>
										);
									})}
								</div>
							</>
						)}

						{display.includes('period') && (
							<>
								{/* Other Options */}
								<ExpenseOptionsTitle>{t('expensesTable.currencyOptions')}</ExpenseOptionsTitle>
								<div className='flex flex-col gap-y-3 mt-3 mb-5'>
									<OptionControl
										checkboxFirst
										state={options?.localPrice}
										setState={(value) => setOption('localPrice', value)}
										text={t('toggles.localPrice', { currency: defaultCurrency, ns: 'translation' })}
									/>
									<OptionControl
										state={options?.showTax}
										setState={(value) => setOption('showTax', value)}
										checkboxFirst
										text={t('toggles.showTax', { ns: 'translation' })}
									/>
								</div>
							</>
						)}
					</div>
				</div>
			) : (
				// Not expanded, display nothing
				''
			)}
		</div>
	);
}
ExpenseOptions.defaultProps = {
	setOption: () => console.log('Set Option fn missing'),
	options: {},
	display: ['category', 'period', 'options'],
};

function ExpenseOptionItem({ isActive = false, text = '', ...props }) {
	if (isActive) {
		return (
			<button type='button' className='badge' {...props}>
				{text}
			</button>
		);
	} else {
		return (
			<button type='button' className='badge badge-outline' {...props}>
				{text}
			</button>
		);
	}
}

function ExpenseOptionsTitle({ children, onClick = null }) {
	return (
		<div className='w-full font-medium text-md mt-2 mb-1 flex items-center border-b'>
			{/* First Row */}
			{children}
			{onClick && (
				<button type='button' className='p-1 text-sm opacity-75 bg-base-300 ml-1 rounded-md' onClick={onClick}>
					<FaUndoAlt />
				</button>
			)}
		</div>
	);
}
