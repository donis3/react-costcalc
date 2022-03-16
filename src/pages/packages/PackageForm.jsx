import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { FormFooterActions } from '../../components/common/FormFooterActions';
import FormInput from '../../components/form/FormInput';
import PackageFormTable from './packageForm/PackageFormTable';

export default function PackageForm({ isEdit = false } = {}) {
	const { packageId } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation('pages/packages');

	useEffect(() => {
		//verify package if this is edit mode
		if (isEdit === true && isNaN(parseInt(packageId))) {
			return navigate('/packages');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packageId, isEdit]);

	//Physical States
	const physicalStates = [
		{ name: t('physicalStates.liquid', { ns: 'translation' }), value: 'liquid' },
		{ name: t('physicalStates.solid', { ns: 'translation' }), value: 'solid' },
	];

	//Render
	return (
		<>
			{/* Back Button */}
			<div className='mb-1'>
				<Link to='/packages'>
					<Button.Back />
				</Link>
			</div>
			{/* Form */}
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<h3 className='text-2xl py-2 font-semibold'>
					{/* Form title depending on context */}
					{t('form.addTitle')}
				</h3>
				<p className='opacity-80'>
					{/* Form lead depending on context */}
					{t('form.details')}
				</p>
				<form onSubmit={(e) => e.preventDefault()} className='w-full mt-10'>
					{/* Form Start*/}

					{/* Flex Container for form */}
					<div className='flex flex-col justify-start gap-10 items-start xl:flex-row gap-y-20 xl:gap-y-0 gap-x-10'>
						{/* Package Definitions Section */}
						<div className='w-full flex flex-col gap-y-5 max-w-lg md:max-w-2xl'>
							<h1 className='text-xl m-0 p-0 border-b-8'>{t('form.subtitle')}</h1>

							{/* name */}
							<FormInput label={t('labels.name')} error={null}>
								<FormInput.Text name='name' />
							</FormInput>
							{/* productType */}
							<FormInput label={t('labels.productType')} error={null} altLabel={t('labels.productTypeAlt')}>
								<FormInput.Select name='productType' options={physicalStates} />
							</FormInput>
							{/* capacity */}
							<FormInput label={t('labels.packageCapacity')} error={null} altLabel={t('labels.packageCapacityAlt')}>
								<FormInput.Group>
									<FormInput.Text name='packageCapacity' filter='number' />
									{/* Unit depends on physical state kg/L */}
									<span>-UNIT-</span>
								</FormInput.Group>
							</FormInput>
							{/* Notes */}
							<FormInput label={t('labels.notes')} error={null}>
								<FormInput.Textarea name='notes' rows='1' />
							</FormInput>
						</div>

						{/* Package Items */}
						<div className='w-full flex flex-col gap-y-5  max-w-lg md:max-w-4xl'>
							<h1 className='text-xl m-0 p-0 border-b-8'>{t('form.packingItemsTitle')}</h1>

							{/* Package Component */}
							<PackageFormTable />
						</div>
					</div>
					{/* Form Footer */}

					<FormFooterActions
						className='mt-10 border-t-2 py-5'
						handleDelete={() => {
							console.log('ok');
						}}
					>
						<Button.Save className='btn btn-primary btn-md mr-1' type='submit' />
						<Button.Reset className='btn btn-md' type='submit' />
					</FormFooterActions>
				</form>
			</Card>
		</>
	);
}
