import { FaCaretDown } from 'react-icons/fa';
import { changeTheme, getCurrentTheme } from '../../helpers/themeHelper';
import config from '../../config/config.json';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function NavThemeSelect() {
	const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());
	const {t} = useTranslation('translation');

	const onChangeTheme = (themeName) => {
		changeTheme(themeName);
		setCurrentTheme(themeName);
	};

	//No theme available
	if (!config.themes || !Array.isArray(config.themes)) {
		return <></>;
	}

	//List themes
	return (
		<div className='dropdown dropdown-end'>
			<div tabIndex='0' className='btn btn-ghost btn-sm rounded-2xl ml-1'>
				{t('header.theme')} <FaCaretDown className='ml-1' />
			</div>
			<ul tabIndex='0' className='p-1 shadow menu dropdown-content bg-base-100 rounded-box w-52 text-base-content'>
				{config.themes.map((item, index) => (
					<ThemeSelectListItem
						key={index}
						themeName={item}
						isActive={currentTheme === item ? true : false}
						onChangeTheme={onChangeTheme}
					/>
				))}
			</ul>
		</div>
	);
}

function ThemeSelectListItem({ themeName, isActive = false, onChangeTheme }) {
	let btnClass = 'rounded-lg';
	if (isActive) btnClass = btnClass + ' active';

	const {t} = useTranslation('translation');

	return (
		<li>
			<button className={btnClass} onClick={() => onChangeTheme(themeName)}>
				{t(`themes.${themeName}`, {defaultValue: themeName}) }
			</button>
		</li>
	);
}
