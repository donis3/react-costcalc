import React from 'react';
import { useTranslation } from 'react-i18next';
import useCompanyInfo from '../../../context/company/useCompanyInfo';
import useIntl from '../../../hooks/common/useIntl';
import useDefaultButtons from '../../../hooks/forms/useDefaultButtons';

export default function RecipeOrder({ recipe, close } = {}) {
	const { t } = useTranslation('pages/recipes', 'translation');
	const { displayDate, displayNumber } = useIntl();
	const { info } = useCompanyInfo();
	const { Print, Cancel } = useDefaultButtons();
	if (!recipe) return <></>;

	return (
		<>
			<div className='flex justify-between mt-8 p-3 print:hidden'>
				<Print onClick={() => window.print()} />
				<Cancel onClick={() => close?.()} />
			</div>
			<div className='w-full p-3 mt-3 mb-10'>
				{/* Title */}
				<div className='flex flex-col gap-y-0 items-center'>
					<h3 className='font-medium text-base leading-none'>{info.name}</h3>
					<h1 className='font-bold text-2xl leading-none'>Manufacturing Order</h1>
				</div>

				<table className='recipe-order mt-3'>
					<tbody>
						<tr>
							<td className='font-semibold'>{t('order.date')}</td>
							<td>{displayDate(Date.now(), { time: false })}</td>
						</tr>

						<tr>
							<td className='font-semibold'>{t('order.product')}</td>
							<td>{recipe.product.name}</td>
						</tr>

						<tr>
							<td className='font-semibold'>{t('order.recipe')}</td>
							<td>{recipe.name}</td>
						</tr>

						<tr>
							<td className='font-semibold'>{t('order.output')}</td>
							<td>
								{displayNumber(recipe.yield, 2)}{' '}
								{t(`units.${recipe.unit}`, { ns: 'translation', count: Math.round(recipe.yield) })}
							</td>
						</tr>
						<tr>
							<td className='order-subtitle' colSpan={2}>
								{t('order.materials')}
							</td>
						</tr>

						{recipe.materials.map((material, i) => {
							return (
								<tr key={i} className='order-material'>
									<td></td>
									<td>
										<span className='mr-5'>
											{displayNumber(material.amount)} {material.unit}
										</span>
										<span>{material.name}</span>
									</td>
								</tr>
							);
						})}

						{recipe.notes && recipe.notes.length > 0 && (
							<>
								<tr>
									<td colSpan={2} className='order-subtitle'>
										{t('order.notes')}
									</td>
								</tr>
								<tr>
									<td colSpan={2} className='whitespace-pre-wrap'>
										{recipe.notes}
									</td>
								</tr>
							</>
						)}
						{/* Footer */}
						<tr>
							<td colSpan={2} className='order-subtitle'>
								{t('order.result')}
							</td>
						</tr>
						<tr>
							<td colSpan={2}>
								<div className='empty-area'></div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}
