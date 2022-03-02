import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import AppContext from '../../context/AppContext';
import ResponsiveModal from '../common/ResponsiveModal';

export default function ThemeSelect({ isOpen = false, setIsOpen }) {
	const { theme } = useContext(AppContext);
	const { t } = useTranslation();

	if (!isOpen) {
		return <></>;
	}

	return (
		<ResponsiveModal title={t('themeSelect.title')} handleCloseBtn={() => setIsOpen(false)}>
			<ul>
				{theme.all.map((item, i) => {
					return (
						<li key={i}>
							<button
								className={
									'btn btn-ghost btn-outline mb-1 w-full justify-center btn-md text-xl ' +
									(item === theme.active ? 'btn-active' : '')
								}
								onClick={() => theme.change(item)}
							>
								{t(`themes.${item}`, { defaultValue: item })}
							</button>
						</li>
					);
				})}
			</ul>
		</ResponsiveModal>
	);
}
