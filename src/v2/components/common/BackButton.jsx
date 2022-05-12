import React from 'react';
import { useTranslation } from 'react-i18next';

import { FaArrowLeft as BackIcon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ children }) {
	const { t } = useTranslation('translation');
	const navigate = useNavigate();

	return (
		<button onClick={() => navigate(-1)} className='btn btn-ghost btn-sm'>
			{children ? (
				children
			) : (
				<>
					<BackIcon className='mr-1' />
					{t('buttons.back')}
				</>
			)}
		</button>
	);
}
