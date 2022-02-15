import React, { useContext, useState } from 'react';
import themeConfig from '../../config/theme';
import { FaBars } from 'react-icons/fa';
import { ReactComponent as Logo } from '../../img/cost-logo.svg';
import './Navbar.css';

import LangSelect from './LangSelect';
import AppContext from '../../context/AppContext';
import ReactCountryFlag from 'react-country-flag';


export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [isLangModalOpen, setLangModalOpen] = useState(false);
	const { language } = useContext(AppContext);

	return (
		<>
			<nav className={`relative px-3 lg:px-5 py-3 ${themeConfig.navbar.bg}`}>
				<div className='container  mx-auto flex flex-wrap items-center justify-between'>
					<div className='w-full flex justify-between lg:w-auto '>
						<a className='text-neutral-content' href='#logo'>
							<Logo width='200' />
						</a>
						<button className='navbar-collapse-btn' type='button' onClick={() => setMenuOpen(!menuOpen)}>
							<FaBars />
						</button>
					</div>
					<div className={'nav-list-container' + (menuOpen ? ' flex' : ' hidden')}>
						<ul className='nav-list'>
							<li className='nav-item'>
								<a href='#pablo'>Discover</a>
							</li>
							<li className='nav-item lg:border-l'>
								<button onClick={() => setLangModalOpen(true)} className=" opacity-50 text-sm">
									{language.nativeName}
									<ReactCountryFlag svg countryCode={language.countryCode} className='ml-2 text-2xl' />
								</button>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			{/* Modals */}

			<LangSelect isOpen={isLangModalOpen} setIsOpen={setLangModalOpen} />
		</>
	);
}
