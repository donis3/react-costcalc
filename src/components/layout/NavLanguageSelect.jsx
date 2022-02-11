import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCaretDown } from 'react-icons/fa';
import { getLangDetails, getCountryCode } from '../../helpers/languages';
import config from '../../config/config.json';
import ReactCountryFlag from 'react-country-flag';

export default function NavLanguageSelect() {
	const { i18n } = useTranslation();
	const lang = getLangDetails(i18n.language);

	const onChangeLanguage = (langCode) => {
		i18n.changeLanguage(langCode);
	};

	return (
		<div className='dropdown dropdown-end'>
			<div tabIndex='0' className='btn btn-ghost btn-sm rounded-2xl ml-1'>
				{lang.nativeName} <FaCaretDown className='ml-1' />
			</div>
			<ul tabIndex='0' className='p-1 shadow menu dropdown-content bg-base-100 rounded-box w-52 text-base-content'>
				{config.languages.map((item, i) => (
					<li className='text-left' key={i}>
						<LanguageSelect  languageCode={item} onChangeLanguage={onChangeLanguage} isActive={i18n.language === item ? true : false} />
					</li>
				))}
			</ul>
		</div>
	);
}

function LanguageSelect({ languageCode, onChangeLanguage, isActive = false }) {
	const details = getLangDetails(languageCode);
	const countryCode = getCountryCode(languageCode);

    let defaultClass = 'btn btn-ghost rounded-lg justify-start min-w-fit';
	if( isActive) {
		defaultClass = defaultClass + ' active';
	}
	return (
		<button className={defaultClass} onClick={() => onChangeLanguage(languageCode)}>
			<ReactCountryFlag svg countryCode={countryCode} className='mr-2 inline-block' />
			{details.nativeName}
		</button>
	);
}
