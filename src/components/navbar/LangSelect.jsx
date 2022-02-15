import React, { useContext } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import AppContext from '../../context/AppContext';
import ResponsiveModal from '../common/ResponsiveModal';

export default function LangSelect({ isOpen = false, setIsOpen }) {
	const { t } = useTranslation();
	const { language } = useContext(AppContext);

	

	if (!isOpen) {
		return <></>;
	}

	return (
		<ResponsiveModal title={t('langSelect.title')} handleCloseBtn={() => setIsOpen(false)} >
			<ul>
				{language.all.map((item, index) => {
					return (
						<li key={index}>
							<button
								className={'btn btn-ghost btn-outline mb-1 w-full justify-center btn-md text-xl '+
                                (item.code === language.code ? 'btn-active' : '')
                            }
								onClick={() => language.change(item.code)}
							>
								{item.nativeName}
                                <ReactCountryFlag svg countryCode={item.countryCode} className='ml-2 text-2xl' />
							</button>
						</li>
					);
				})}
			</ul>
		</ResponsiveModal>
	);
}
