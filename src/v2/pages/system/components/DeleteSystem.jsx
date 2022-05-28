import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/common/Card';
import DeleteButton from '../../../components/common/DeleteButton';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import { FaTrashAlt } from 'react-icons/fa';
import useSystem from '../../../hooks/system/useSystem';

export default function DeleteSystem() {
	const { t } = useTranslation('pages/system');
	const { actions } = useSystem();

	return (
		<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
			<ModuleHeader text={t('delete.title')} module='system' role='main' customIcon='FaBomb' />
			<p className='opacity-80 text-sm'>{t('delete.lead')}</p>

			<div className='col-span-full border-t pt-3 mt-10'>
				<DeleteButton onClick={() => actions.deleteSystem()} className='btn bg-red-500 hover:bg-red-900 flex gap-x-1'>
					<FaTrashAlt /> {t('delete.deleteAll')}
				</DeleteButton>
			</div>
		</Card>
	);
}
