import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import CollapsiblePanel from '../../../components/common/CollapsiblePanel';
import Icon from '../../../components/common/Icon';
import FormInput from '../../../components/form/FormInput';
import useCurrency from '../../../hooks/app/useCurrency';


export default function AddPackageItem() {
	const { t } = useTranslation('pages/packages', 'translation');
    const {currencies: {getCurrencySelectArray}} = useCurrency();
    
    const itemTypes = [
        {name: t('packageTypes.box', {ns: 'translation'}), value: 'box'},
        {name: t('packageTypes.container', {ns: 'translation'}), value: 'container'},
        {name: t('packageTypes.other', {ns: 'translation'}), value: 'other'},
    ];
    

	return (
		<>
			<CollapsiblePanel
				background='bg-base-200'
				className='mt-10 border rounded-md'
                collapsed={false}
				header={
					<h3 className='font-medium text-base flex items-center gap-x-2'>
						{t('form.addItemTitle')}
						<Icon icon={'FaPlusCircle'} className='text-green-700' />
					</h3>
				}
			>
				<div className='grid grid-cols-12 p-3 gap-y-3 gap-x-3 border-t'>
					{/* row 1 */}
					<FormInput label={t('labels.itemName')} error={null} className='col-span-8 col-end-9'>
						<FormInput.Text name='name' />
					</FormInput>

					<FormInput label={t('labels.itemType')} error={null} className='col-span-4 col-end-13'>
						<FormInput.Select name='packageType' options={itemTypes} />
					</FormInput>

					{/* row 2 */}
					<FormInput label={t('labels.itemPrice')} error={null} className='col-span-4 col-end-5'>
						<FormInput.Text name='name' />
					</FormInput>
					<FormInput label={t('labels.itemTax')} error={null} className='col-span-4 col-end-9'>
						<FormInput.Text name='name' />
					</FormInput>
					<FormInput label={t('labels.itemCurrency')} error={null} className='col-span-4 col-end-13'>
						<FormInput.Select name='name' options={getCurrencySelectArray()} />
					</FormInput>

					{/* row 3 */}
					<FormInput
						label={t('labels.boxCapacity')}
						error={null}
						altLabel={t('labels.boxCapacityAlt')}
						className='col-span-4 col-end-5'
					>
						<FormInput.Text name='name' filter='number' />
					</FormInput>
					<div className='col-span-full flex justify-center items-center'>
						<Button.Add className='btn btn-block'>
							<Icon icon='FaArrowCircleUp' className='mr-1' /> {t('form.addItem')}
						</Button.Add>
					</div>
				</div>
			</CollapsiblePanel>
		</>
	);
}
