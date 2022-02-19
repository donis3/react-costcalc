import React, { useState } from 'react';
import Card from '../../common/Card';
import BottomPanel from '../../common/BottomPanel';

const mockData = {
	materials: [
		{ materialId: 1, name: 'Potassium Chloride', unit: 'kg', tax: '18', price: 8.4, currency: 'USD' },
		{ materialId: 2, name: 'Hydrochloric Acid', unit: 'kg', tax: '18', price: 2.9, currency: 'USD' },
	],
};

export default function Materials() {
	const [isPanelOpen, setPanelOpen] = useState(false);

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<div className='w-full flex justify-end'>
					<button
						className='btn btn-primary btn-sm'
						onClick={() => {
							setPanelOpen(true);
						}}
					>
						+New
					</button>
				</div>
				<h3 className='text-2xl py-2 font-semibold'>Title</h3>
				<p className='opacity-80'>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat cupiditate similique amet adipisci eligendi
					pariatur cumque qui quasi sequi aut!
				</p>
				<MaterialTable></MaterialTable>
			</Card>
			<BottomPanel
				title='test'
				isOpen={isPanelOpen}
				handleClose={() => {
					setPanelOpen(false);
				}}
			>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos aut recusandae a magni cumque aspernatur
				maiores eveniet. Ab, recusandae cupiditate!
			</BottomPanel>
		</>
	);
}

function MaterialTable() {
	return (
		<div className='overflow-x-auto my-10'>
			<table className='table table-zebra w-full table-normal table-fixed'>
				<thead>
					<tr>
						<th className='w-1/12'></th>
						<th className='w-5/12'>Material</th>
						<th className='w-1/12'>Unit</th>
						<th className='w-1/12'>Tax</th>
						<th className='w-2/12'>Price</th>
						<th className='w-2/12'></th>
					</tr>
				</thead>
				<tbody>
					{mockData.materials.map((material) => {
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
