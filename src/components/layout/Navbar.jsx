import React, { useContext, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { ReactComponent as Logo } from '../../img/cost-logo.svg';
import './Navbar.css';

import LangSelect from './LangSelect';
import AppContext from '../../context/AppContext';
import ReactCountryFlag from 'react-country-flag';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
	const { t } = useTranslation('routes');
	const [menuOpen, setMenuOpen] = useState(false);
	const [isLangModalOpen, setLangModalOpen] = useState(false);
	const { language } = useContext(AppContext);

	return (
		<>
			<nav className={`relative px-3 lg:px-5 py-3 bg-neutral`}>
				<div className='container  mx-auto flex flex-wrap items-center justify-between'>
					<div className='w-full flex justify-between lg:w-auto'>
						
						<Link to="/" className='text-neutral-content'>
							<Logo width='200' />
						</Link>
						<button className='navbar-collapse-btn' type='button' onClick={() => setMenuOpen(!menuOpen)}>
							<FaBars />
						</button>
					</div>
					<div className={'nav-list-container lg:w-3/5 ' + (menuOpen ? ' flex' : ' hidden')}>
						<ul className='nav-list  flex flex-wrap'>
							<NavbarItem to="/">{t('home')}</NavbarItem>
							<NavbarItem to="/materials">{t('materials')}</NavbarItem>
							<li className='nav-item lg:border-l lg:mt-0 mt-3 ml-3 border-white border-opacity-50'>
								<button onClick={() => setLangModalOpen(true)} className=' opacity-50 text-sm'>
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

function NavbarItem({ children, to = '/' }) {
	const activeLink = ({ isActive }) => {
		if (isActive) {
			return 'border-b  border-white';
		} else {
			return '';
		}
	};
	return (
		<li className='nav-item'>
			<NavLink to={to} className={activeLink}>
				{children}
			</NavLink>
		</li>
	);
}
