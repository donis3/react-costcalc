import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';

import RecipesTable from './table/RecipesTable';

export default function Recipes() {
	const { t } = useTranslation('pages/recipes');

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={t('recipes.title')} module='recipes' role='main'>
					{/* Links */}
					<Link to='/recipes/add'>
						<Button.New name={t('name')} />
					</Link>
				</ModuleHeader>

				{/* Lead Text */}
				<p className='opacity-80'>{t('recipes.lead')}</p>

				<RecipesTable />
			</Card>
		</>
	);
}
