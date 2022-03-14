import React, { useContext } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { useCurrencyDispatch } from '../../context/MainContext';
import useConfig from '../../hooks/app/useConfig';
import useStorageState from '../../hooks/common/useStorageState';
import ResponsiveModal from '../common/ResponsiveModal';

export default function LangSelect({ isOpen = false, setIsOpen }) {
	const { t } = useTranslation();
	const { language } = useContext(AppContext);

	if (!isOpen) {
		return <></>;
	}

	return (
		<ResponsiveModal title={t('langSelect.title')} handleClose={() => setIsOpen(false)}>
			<ul>
				{language.all.map((item, index) => {
					return (
						<li key={index}>
							<button
								className={
									'btn btn-ghost btn-outline mb-1 w-full justify-center btn-md text-xl ' +
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
			<SelectCurrency handleClose={() => setIsOpen(false)} />
		</ResponsiveModal>
	);
}

function SelectCurrency({ handleClose = null } = {}) {
	const config = useConfig();
	const currencies = config.getCurrencies(true);
	const defaultCurrency = config.getDefaultCurrency(true);
	const { t } = useTranslation();
	const [defaultCur, setDefaultCur] = useStorageState('defaultCurrency', defaultCurrency);
	const navigate = useNavigate();
	const { dispatch } = useCurrencyDispatch();

	const changeDefaultCurrency = (code) => {
		if (code === defaultCur) return;
		setDefaultCur(code);
		//Remove stored currency data
		dispatch({ type: 'reset', payload: null });
		handleClose();
		navigate('/'); //Reload
	};

	return (
		<div className='w-full mt-10'>
			<h3 className='text-xl border-b-4'>{t('currency.changeDefault')}</h3>
			<p className='py-1 text-sm opacity-70 italic'>
				{t('currency.changeDefaultWarning')}
			</p>
			<ul className='flex gap-3 mt-5'>
				{currencies.map((item) => {
					return (
						<li key={item.code}>
							<button
								type='button'
								className={`btn ${item.code === defaultCur && 'btn-primary'}`}
								onClick={() => changeDefaultCurrency(item.code)}
							>
								{t(`currency.${item.code}`)} ({item.symbol})
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
