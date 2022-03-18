import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

import RecipesTable from './table/RecipesTable';

export default function Recipes() {
	const { t } = useTranslation('pages/recipes');

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				{/* Page Header */}
				<div className='w-full flex justify-between items-center'>
					<h3 className='text-2xl py-2 font-semibold'>{t('recipes.title')}</h3>
					<Link to='/recipes/add'>
						<Button.New type="button" name={t('name')} />
					</Link>
				</div>
				{/* Lead Text */}
				<p className='opacity-80'>{t('recipes.lead')}</p>

				<RecipesTable />
			</Card>
		</>
	);
}
