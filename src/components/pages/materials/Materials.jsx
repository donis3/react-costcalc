import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataContext from '../../../context/DataContext';
import PanelContext from '../../../context/PanelContext';

import Card from '../../common/Card';
import MaterialForm from './MaterialForm';

export default function Materials() {
	const { t } = useTranslation('pages/materials');
	const panel = useContext(PanelContext);

	const handleOpenMaterialForm = () => {
		return panel.open({
			id: 'add-material-form',
			title: t('form.title'),
			content: <MaterialForm />,
			reload: false,
		});
	};

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<div className='w-full flex justify-end'>
					<button className='btn btn-primary btn-sm' onClick={handleOpenMaterialForm}>
						{'+' + t('btnNew')}
					</button>
				</div>
				<h3 className='text-2xl py-2 font-semibold'>{t('title')}</h3>
				<p className='opacity-80'>{t('lead')}</p>
				<MaterialTable />
			</Card>
		</>
	);
}

function MaterialTable() {
	const { materials } = useContext(DataContext);
	const { t } = useTranslation('pages/materials');

	return (
		<div className='overflow-x-auto my-10'>
			<table className='table table-zebra w-full table-normal table-fixed'>
				<thead>
					<tr>
						<th className='w-1/12'></th>
						<th className='w-5/12'>{t('table.material')}</th>
						<th className='w-1/12'>{t('table.unit')}</th>
						<th className='w-1/12'>{t('table.tax')}</th>
						<th className='w-2/12'>{t('table.price')}</th>
						<th className='w-2/12'></th>
					</tr>
				</thead>
				<tbody>
					{materials.all.map((material) => {
						return <MaterialTableRow key={material.materialId} {...material} actions={null} />;
					})}
				</tbody>
			</table>
		</div>
	);
}

function MaterialTableRow({ materialId, name, unit, tax, price, actions = null }) {
	return (
		<tr className='hover'>
			<th className='truncate' title={materialId}>
				{materialId}
			</th>
			<td className='whitespace-normal'>{name}</td>
			<td className='truncate' title={unit}>
				{unit}
			</td>
			<td>{tax}</td>
			<td>{price}</td>
			<td></td>
		</tr>
	);
}
