import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes } from 'react-icons/fa';

export function FormFooterActions({ handleDelete = null, handleClose = null }) {
	const { t } = useTranslation('translation');
	const [deleteBtnState, setDeleteBtnState] = useState({ step: 0 });

	return (
		<div className='w-full flex justify-between'>
			<div>
				<button type='submit' className='btn btn-primary btn-md mr-2'>
					{t('buttons.save')}
				</button>
				<button type='button' className='btn btn-ghost btn-outline btn-md' onClick={handleClose}>
					{t('buttons.close')}
				</button>
			</div>

			{deleteBtnState.step === 0 && (
				<div>
					<button className='btn btn-error btn-md' type='button' onClick={() => setDeleteBtnState({ step: 1 })}>
						{t('buttons.delete')}
					</button>
				</div>
			)}
			{deleteBtnState.step === 1 && (
				<div>
					<span className='mr-2 font-semibold'>{t('buttons.deleteConfirm')}</span>
					<button type='button' className='btn btn-outline btn-md' onClick={() => setDeleteBtnState({ step: 0 })}>
						<FaTimes className='mr-1' />
						{t('buttons.no')}
					</button>
					<button type='button' className='btn btn-outline ml-2 text-red-600 btn-md' onClick={handleDelete}>
						<FaCheck className='mr-1' />
						{t('buttons.yes')}
					</button>
				</div>
			)}
		</div>
	);
}
